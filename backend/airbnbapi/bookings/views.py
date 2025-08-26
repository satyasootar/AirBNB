from django.shortcuts import render , redirect
from datetime import date
from rest_framework import viewsets, status 
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response 
from rest_framework.decorators import permission_classes
from .models import Booking, BookingStatus, Payment , PaymentStatus
from .serializers import BookingSerializer, PaymentSerializer
from .permissions import IsBookingOwnerOrHost
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from datetime import date
from django.urls import reverse
# Create your views here.



class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # Guests see their own bookings by default
        # Hosts can pass ?role=host to see bookings on their listings
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

        # Prevent booking if check-in date is in the past
        if check_in < date.today():
            raise ValidationError({"detail": "Check-in date cannot be in the past."})

        # Prevent booking if check-out is before check-in
        if check_out <= check_in:
            raise ValidationError({"detail": "Check-out must be after check-in."})

        # Check for overlapping bookings
        overlap = Booking.objects.filter(
            listing=listing,
            status=BookingStatus.CONFIRMED,
        ).filter(
            Q(check_in__lt=check_out) & Q(check_out__gt=check_in)
        )

        if overlap.exists():
            raise ValidationError({"detail": "This listing is already booked for the selected dates."})

        # Save booking with pending status
        booking = serializer.save(user=self.request.user, status=BookingStatus.PENDING)
        
        # Calculate price (basic: nights * listing.price_per_night)
        nights = (check_out - check_in).days
        total_amount = listing.price_per_night * nights

        # Create a Payment object
        payment = Payment.objects.create(
            booking=booking,
            amount=total_amount,
            status=PaymentStatus.PENDING,
        )

        print("Payment : ",payment)
        return payment

      



    @action(detail=True, methods=["put"], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        # Only booking owner or listing host can cancel
        if not IsBookingOwnerOrHost().has_object_permission(request, self, booking):
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)


        # Simple rule: cannot cancel on/after check-in day
        if booking.check_in <= date.today():
            return Response({"detail": "You can no longer cancel on/after the check-in date."},status=status.HTTP_400_BAD_REQUEST,)


        booking.status = BookingStatus.CANCELLED
        booking.save(update_fields=["status"])
        return Response(self.get_serializer(booking).data)





class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self , request, pk):
        try :
            payment = Payment.objects.get(booking_id = pk)
            booking = payment.booking
            price = int(booking.total_price)
            payment.amount = price
            print("HEHHE", price)
            payment.save(update_fields=["amount"])
            serializer = PaymentSerializer(payment)
            
            return Response(serializer.data)
            
        except Payment.DoesNotExist:
            return Response({"detail": "No Payment matches the given query."}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk):
        print('PK: ', pk)
        print("status : ", request.data.get("status"))
        try:
            
            payment = Payment.objects.get(booking_id=pk)
            print(payment)
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
                print("Price:", booking.total_price)
                
                booking.save(update_fields=["status" , "total_price"])
            else:
                payment.status = PaymentStatus.FAILED
                payment.save(update_fields=["status"])
                
            serializer = PaymentSerializer(payment) 
            return Response(serializer.data)
        except Payment.DoesNotExist:
            return Response({"detail": "No Payment matches the given query."}, status=status.HTTP_404_NOT_FOUND) 
        

        
        
