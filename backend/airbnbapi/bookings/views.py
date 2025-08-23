from django.shortcuts import render
from datetime import date
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Booking, BookingStatus, Payment
from .serializers import BookingSerializer, PaymentSerializer
from .permissions import IsBookingOwnerOrHost
# Create your views here.


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def host_bookings(request):
    # get all bookings where the listing belongs to this host
    bookings = Booking.objects.all()
    print("LLLL: ",bookings)
    serializer = BookingSerializer(bookings, many=True)
    
    return Response(serializer.data)


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
        if serializer.is_valid():
            serializer.save()


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