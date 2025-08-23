from decimal import Decimal
from rest_framework import serializers
from listings.models import HotelsListing
from .models import Booking, BookingStatus, Payment, PaymentStatus




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
    

class BookingSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(queryset=HotelsListing.objects.all())
    listing_info = SimpleListingSerializer(source="listing", read_only=True)


    # always include the user who booked
    user = serializers.SerializerMethodField(read_only=True)


    nights = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Booking
        fields = ["id","listing","listing_info","user","check_in","check_out","guests","total_price","status","nights","created_at","updated_at" ]
        read_only_fields = ["total_price","status","created_at","updated_at","user","listing_info","nights" ]



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
        listing = attrs["listing"]
        check_in = attrs["check_in"]
        check_out = attrs["check_out"]


        if check_in >= check_out:
            raise serializers.ValidationError("check_out must be after check_in.")


    # prevent overlapping reservations (pending/confirmed/completed)
        qs = (Booking.objects.filter(
        listing=listing,
        status__in=[ BookingStatus.PENDING, BookingStatus.CONFIRMED,BookingStatus.COMPLETED,],
        check_in__lt=check_out, 
        check_out__gt=check_in,)
        )
        # during updates, allow keeping your own dates
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Those dates are not available.")


        return attrs


    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None


        listing = validated_data["listing"]
        nights = (validated_data["check_out"] - validated_data["check_in"]).days
        total_price = Decimal(nights) * Decimal(listing.price_per_night)


        validated_data["user"] = user
        validated_data["total_price"] = total_price
        # status defaults to pending
        return Booking.objects.create(**validated_data)
    


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [ "id", "booking", "amount", "status", "payment_method", "transaction_id", "created_at",]
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