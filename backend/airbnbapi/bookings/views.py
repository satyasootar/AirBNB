from django.shortcuts import render , redirect
from datetime import date
from rest_framework import viewsets, status 
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response 
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt import authentication
from .models import Booking, BookingStatus, Payment , PaymentStatus
from .serializers import BookingSerializer, PaymentSerializer
from .permissions import IsBookingOwnerOrHost
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from datetime import date
from django.urls import reverse
from decimal import Decimal

# Create your views here.



class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role = self.request.query_params.get("role")
        qs = (
            Booking.objects.select_related("listing", "user", "listing__host_id")
            .all()
            .order_by("-created_at")
        )
        if role == "host":
            return qs.filter(listing__host_id=self.request.user)
        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        check_in = serializer.validated_data["check_in"]
        check_out = serializer.validated_data["check_out"]
        listing = serializer.validated_data["listing"]

        # ❌ Check-in in the past
        if check_in < date.today():
            raise ValidationError({"detail": "Check-in date cannot be in the past."})

        # ❌ Check-out before check-in
        if check_out <= check_in:
            raise ValidationError({"detail": "Check-out must be after check-in."})

        # ❌ Overlapping bookings
        overlap = Booking.objects.filter(
            listing=listing,
            status__in=[BookingStatus.CONFIRMED, BookingStatus.PENDING],
        ).filter(Q(check_in__lt=check_out) & Q(check_out__gt=check_in))

        if overlap.exists():
            raise ValidationError(
                {"detail": "This listing is already booked for the selected dates."}
            )

        # ✅ Calculate total and tax
        nights = (check_out - check_in).days
        subtotal = listing.price_per_night * nights
        tax_rate = 0.18
        tax_amount = subtotal * tax_rate
        total_amount = subtotal + tax_amount

        # ✅ Save booking
        booking = serializer.save(
            user=self.request.user,
            status=BookingStatus.PENDING,
            total_price=total_amount,
        )

        # ✅ Create pending payment if not exists
        Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": total_amount,
                "status": PaymentStatus.PENDING,
                "payment_method": "upi",  # optional default
            },
        )

        return booking

    def perform_update(self, serializer):
        """
        ✅ Allow partial booking update — example: confirming payment or changing dates.
        """
        booking = serializer.save()

        # ✅ If payment data is nested, update it inside serializer (handled automatically)
        payment_data = self.request.data.get("payment")
        if payment_data:
            payment, _ = Payment.objects.update_or_create(
                booking=booking,
                defaults={
                    "amount": payment_data.get("amount", str(Decimal(booking.total_price) + Decimal(booking.total_price * 0.18) )),
                    "status": payment_data.get("status", PaymentStatus.PENDING),
                    "payment_method": payment_data.get("payment_method", "upi"),
                    "provider_payment_id": payment_data.get("provider_payment_id"),
                },
            )

            # ✅ Auto-confirm booking if payment is PAID
            if payment.status == PaymentStatus.PAID:
                booking.status = BookingStatus.CONFIRMED
                booking.save(update_fields=["status"])
                
                return serializer
            return serializer





class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def retrieve(self , request, pk):
        try :
            payment = Payment.objects.get(booking_id = pk)
            booking = payment.booking
            price = int(booking.total_price)
            payment.amount = price
           
            payment.save(update_fields=["amount"])
            serializer = PaymentSerializer(payment)
            
            return Response(serializer.data)
            
        except Payment.DoesNotExist:
            return Response({"detail": "No Payment matches the given query."}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk):
        
        try:
            
            payment = Payment.objects.get(booking_id=pk)
            
            status = request.data.get("status")
            payment_method =  request.data.get("payment_method")
            provider_payment_id =  request.data.get("provider_payment_id")
            amount = request.data.get("amount")
            if status == "paid":
                payment.status = PaymentStatus.PAID
                payment.payment_method = payment_method
                payment.provider_payment_id = provider_payment_id
                payment.amount = amount
                payment.save(update_fields=["status" ,'payment_method','provider_payment_id'])
                booking = payment.booking
                booking.status = BookingStatus.CONFIRMED
                booking.total_price = str(amount)
                
                
                booking.save(update_fields=["status" , "total_price"])
            else:
                payment.status = PaymentStatus.FAILED
                payment.save(update_fields=["status"])
                
            serializer = PaymentSerializer(payment) 
            return Response(serializer.data)
        except Payment.DoesNotExist:
            return Response({"detail": "No Payment matches the given query."}, status=status.HTTP_404_NOT_FOUND) 
        

        
        
