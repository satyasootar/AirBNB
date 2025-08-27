from django.urls import path , include
from bookings import views
from rest_framework.routers import DefaultRouter 
router = DefaultRouter()
router.register(r"", views.BookingViewSet, basename="booking")

router.register(r"payments", views.PaymentViewSet, basename="payment")


urlpatterns = [
    path("", include(router.urls)), 

]