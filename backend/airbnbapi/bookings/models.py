from decimal import Decimal
from django.conf import settings
from django.db import models
from listings.models import HotelsListing
# Create your models here.

class BookingStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"


class Booking(models.Model):
    listing = models.ForeignKey(HotelsListing, on_delete=models.CASCADE,related_name="bookings",)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="bookings",)
    check_in = models.DateField()
    check_out = models.DateField()
    
    
    adult = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    infant = models.PositiveIntegerField(default=0)

    # Calculated server-side (nights × listing.price_per_night)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)


    status = models.CharField(
    max_length=12, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        indexes = [
        models.Index(fields=["listing", "check_in", "check_out"]),
        models.Index(fields=["user", "status"]),
        ]
        ordering = ["-created_at"]


    def __str__(self):
        return f"Booking #{self.pk} for {self.listing.title} by {self.user}"


    @property
    def nights(self) -> int:
        return (self.check_out - self.check_in).days
    
class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PAID = "paid", "Paid"
    FAILED = "failed", "Failed"
    REFUNDED = "refunded", "Refunded"

class PaymentMethod(models.TextChoices):
    CARD = "card", "Card"
    UPIID = "upiID", "UPIUPIID"
    UPIQR = "upiQR", "UPIQR"
    NETBANKING = "netbanking", "NETBANKING"

class Payment(models.Model):
    booking = models.OneToOneField("Booking", on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_method = models.CharField( max_length=11, choices=PaymentMethod.choices)
    provider_payment_id  = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ["-created_at"]


    def __str__(self):
        return f"Payment {self.status} {self.amount} for Booking {self.booking_id}"
    