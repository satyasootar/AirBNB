from django.urls import path , include
from bookings import views
from rest_framework.routers import DefaultRouter
from bookings.views import host_bookings
router = DefaultRouter()
router.register(r"", views.BookingViewSet, basename="booking")
router.register(r"payments", views.PaymentViewSet, basename="payment")


urlpatterns = [
    path("", include(router.urls)),
    path("host/", host_bookings, name="host-bookings"),

]