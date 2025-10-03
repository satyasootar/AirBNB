from rest_framework import serializers
from .models import Users
from django.contrib.auth.hashers import make_password



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'role', 'date_joined', 'password' , "profile_pic"]
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        role = validated_data.get('role','GU')
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)   
        user.is_staff = (role =="HO")
        user.save()
        return user
