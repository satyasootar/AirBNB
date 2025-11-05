
from rest_framework import generics , viewsets ,mixins
from users.permissions import IsSuperUser , IsSuperUserOrReadOnly
from rest_framework.authentication import BasicAuthentication
# from .authentication import AdminAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from listings.models import HotelsListing
from listings.serializers import HotelsListingSerializer
from users.models import Users
from users.serializers import UserSerializer
from bookings.models import Booking
from bookings.serializers import BookingSerializer


class AdminListingsViewset(viewsets.ModelViewSet):
    queryset = HotelsListing.objects.all()
    serializer_class = HotelsListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUserOrReadOnly]

    def get(self , request):
        return self.list(request)
    
    def post(self , request): 
        return self.create(request)


class AdminListingDetailViewset(generics.GenericAPIView , mixins.RetrieveModelMixin , mixins.UpdateModelMixin , mixins.DestroyModelMixin):
    queryset = HotelsListing
    serializer_class = HotelsListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUser]
    
    
    def get(self,request , pk):
        return self.retrieve(request , pk)
    
    def put(self , request , pk):
        return self.update(request , pk)
    
    def delete(self , request , pk):
        return self.destroy(request , pk)
    
    
    

class AdminUserViewset(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUser]

    def get(self , request):
        return self.list(request)
    
    def post(self , request): 
        return self.create(request)
    
    

class AdminUserDetailViewset(generics.GenericAPIView , mixins.RetrieveModelMixin , mixins.UpdateModelMixin , mixins.DestroyModelMixin):
    queryset = Users
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUser]
    
    
    def get(self,request , pk):
        return self.retrieve(request , pk)
    
    def put(self , request , pk):
        return self.update(request , pk)
    
    def delete(self , request , pk):
        return self.destroy(request , pk)
    
    
    

    
class AdminBookingViewset(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUser]    
    
    def get(self , request):
        return self.list(request)
    
    def post(self , request): 
        return self.create(request)
    
  

class AdminBookingDetailViewset(generics.GenericAPIView , mixins.RetrieveModelMixin , mixins.UpdateModelMixin , mixins.DestroyModelMixin):
    queryset = Booking
    serializer_class = BookingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSuperUser]
    
    
    def get(self,request , pk):
        return self.retrieve(request , pk)
    
    def put(self , request , pk):
        return self.update(request , pk)
    
    def delete(self , request , pk):
        return self.destroy(request , pk)
    
    