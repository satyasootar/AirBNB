from django.db import models
import cloudinary
import cloudinary.uploader
import cloudinary.models
from django.contrib.postgres.fields import ArrayField
# Create your models here.
from django.contrib.auth import get_user_model

Users=get_user_model()

class RoomList(models.Model):
    bedroom = models.IntegerField(default=1)
    bathroom = models.IntegerField(default=1)
    beds = models.IntegerField(default=1)
    guest = models.IntegerField(default=2)
    booked_from = models.DateField(blank=True , null=True)
    booked_to = models.DateField(blank=True , null=True)
    is_reserved = models.BooleanField(default=False)

    def __str__(self):
        
        return f"{self.bedroom}BR/{self.bathroom}BA ({self.beds} beds) for {self.guest} guests"


class Location(models.Model):
    city = models.CharField(max_length=100,blank=True)
    state = models.CharField(max_length=100,blank=True)
    country = models.CharField(max_length=100,blank=True)
    lat = models.CharField(default="20.648605079085772")
    lon = models.CharField(default="85.58521124492003")
    def __str__(self):

        return ", ".join([p for p in [self.city, self.state, self.country] if p])
  

class HotelsListing(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    multiple_rooms = models.IntegerField(default=1)
    rooms = models.ManyToManyField(RoomList,blank=True, related_name="hotels")
    location = models.ForeignKey(Location ,blank=True, on_delete=models.CASCADE)
    address = models.TextField()
    price_per_night = models.IntegerField(default=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    host_id = models.ForeignKey(Users , on_delete=models.DO_NOTHING)

    offersOrExtras = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list
    )
    
    def __str__(self):
        return f'{self.title} --- {self.host_id.username}'
    
    
    
    

class HotelImages(models.Model):
    hotel = models.ForeignKey(HotelsListing , on_delete=models.CASCADE , related_name="images")
    image =cloudinary.models.CloudinaryField('image', blank=True, null=True)  # Cloudinary image

    def __str__(self):
        return f'Images of {self.hotel.title}'
    
    

class Review(models.Model):
    hotel = models.ForeignKey(
        HotelsListing,
        related_name="reviews",
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        Users,
        related_name="reviews",
        on_delete=models.CASCADE
    )
    cleanliness = models.IntegerField(null=True, blank=True)
    location = models.IntegerField(null=True, blank=True)
    service = models.IntegerField(null=True, blank=True) 
    rating = models.PositiveSmallIntegerField(default=3)  # 1-5 scale
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("hotel", "user")  # ❌ one user cannot review same hotel twice
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review({self.user.username} -- {self.hotel.title})"
