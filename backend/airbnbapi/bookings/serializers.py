from decimal import Decimal
from rest_framework import serializers
from listings.models import HotelsListing
from .models import Booking, BookingStatus, Payment, PaymentStatus
from decimal import Decimal



class SimpleUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_null=True)


class SimpleListingSerializer(serializers.ModelSerializer):
    host = serializers.SerializerMethodField()


    class Meta:
        model = HotelsListing
        fields = [
        "id",
        "title",
        "address",
        "price_per_night",
        "host",
        ]


    def get_host(self, obj):
        u = getattr(obj, "host_id", None)
        if not u:
            return None
        return {
            "id": u.id,
            "username": getattr(u, "username", None),
            "email": getattr(u, "email", None),
            "role": getattr(u, "role", None),
            }



    
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [ "id", "booking", "amount", "status", "payment_method", "provider_payment_id", "created_at",]
        read_only_fields = ["created_at"]


    def create(self, validated_data):
        payment = Payment.objects.create(**validated_data)
        
        # If paid, flip booking to confirmed
        if payment.status == PaymentStatus.PAID:
            b = payment.booking
        if b.status == BookingStatus.PENDING:
            b.status = BookingStatus.CONFIRMED
            b.save(update_fields=["status"])
        return payment
    
    
    

class BookingSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(queryset=HotelsListing.objects.all())
    listing_info = SimpleListingSerializer(source="listing", read_only=True)

    user = serializers.SerializerMethodField(read_only=True)
    nights = serializers.SerializerMethodField(read_only=True)
    payment = PaymentSerializer(required=False)

    # NEW FIELD
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "listing",
            "listing_info",
            "user",
            "check_in",
            "check_out",
            "adult", 
            "children", 
            "infant",
            "total_price",
            "tax_amount",
            "status",
            "nights",
            "payment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "status",
            "created_at",
            "updated_at",
            "user",
            "listing_info",
            "nights",
            "tax_amount",
        ]

    def get_user(self, obj):
        u = obj.user
        return {
            "id": u.id,
            "username": getattr(u, "username", None),
            "email": getattr(u, "email", None),
        }

    def get_nights(self, obj):
        return obj.nights

    def validate(self, attrs):
        # For PATCH, keep existing values if not provided
        instance = getattr(self, 'instance', None)
        listing = attrs.get("listing") or getattr(instance, "listing", None)
        check_in = attrs.get("check_in") or getattr(instance, "check_in", None)
        check_out = attrs.get("check_out") or getattr(instance, "check_out", None)

        # Run validations only if both dates exist
        if check_in and check_out and check_in >= check_out:
            raise serializers.ValidationError("check_out must be after check_in.")

        # Prevent overlapping reservations only for new/updated bookings
        if listing and check_in and check_out:
            qs = Booking.objects.filter(
                listing=listing,
                status__in=[
                    BookingStatus.PENDING,
                    BookingStatus.CONFIRMED,
                    BookingStatus.COMPLETED,
                    BookingStatus.CANCELLED
                ],
                check_in__lt=check_out,
                check_out__gt=check_in,
            )
            # exclude self during update
            if instance:
                qs = qs.exclude(pk=instance.pk)
            if qs.exists():
                raise serializers.ValidationError("Those dates are not available.")

        return attrs


    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None

        payment_data = validated_data.pop("payment", None)
        listing = validated_data["listing"]

        nights = (validated_data["check_out"] - validated_data["check_in"]).days

        # ✅ Calculate base total and tax
        price_per_night = Decimal(listing.price_per_night)
        subtotal = Decimal(nights) * price_per_night
        tax_rate = Decimal("0.18")  # 18% GST
        tax_amount = subtotal * tax_rate
        total_price = subtotal 

        validated_data["user"] = user
        validated_data["total_price"] = total_price

        booking = Booking.objects.create(**validated_data)

        # Attach tax amount to serializer output (not saved in DB)
        booking.tax_amount = tax_amount

        if payment_data:
            payment_data["booking"] = booking
            payment = Payment.objects.create(**payment_data)
            if payment.status == PaymentStatus.PAID:
                booking.status = BookingStatus.CONFIRMED
                booking.save(update_fields=["status"])
            if payment.status == PaymentStatus.FAILED or payment.status == PaymentStatus.REFUNDED :
                booking.status = BookingStatus.CANCELLED
                booking.save(update_fields=["status"])
            if payment.status == PaymentStatus.PENDING:
                booking.status = BookingStatus.PENDING
                booking.save(update_fields=["status"])
        return booking

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Recalculate tax for display (ensures correct value even when fetched later)
        try:
            nights = instance.nights
            price_per_night = Decimal(instance.listing.price_per_night)
            subtotal = Decimal(nights) * price_per_night
            tax_amount = subtotal * Decimal("0.18")
            data["tax_amount"] = round(tax_amount, 2)
        except Exception:
            data["tax_amount"] = None

        return data

    def update(self, instance, validated_data):
        payment_data = validated_data.pop("payment", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if payment_data:
            payment, created = Payment.objects.update_or_create(
                booking=instance, defaults=payment_data
            )
            if payment.status == PaymentStatus.PAID:
                instance.status = BookingStatus.CONFIRMED
                instance.save(update_fields=["status"])
            if payment.status == PaymentStatus.FAILED or payment.status == PaymentStatus.REFUNDED :
                instance.status = BookingStatus.CANCELLED
                instance.save(update_fields=["status"])
            if payment.status == PaymentStatus.PENDING:
                instance.status = BookingStatus.PENDING
                instance.save(update_fields=["status"])
                

        return instance
