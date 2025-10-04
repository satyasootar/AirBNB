from django.contrib import admin
from bookings.models import Booking  , Payment 

# Register your models here.
admin.site.register(Booking)
admin.site.register(Payment)