from django.db import models
from django.contrib.auth.models import AbstractUser

import cloudinary
import cloudinary.uploader
import cloudinary.models



class Users(AbstractUser):
    class Role(models.TextChoices):
        Guest  = 'GU', 'Guest'
        Host = "HO" , "Host"


    date_of_birth = models.DateField(null=True , blank=True)
    role = models.CharField(max_length=3 , choices=Role.choices , default=Role.Guest)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_pic = cloudinary.models.CloudinaryField("profile_pic", blank=True, null=True)
    
    



