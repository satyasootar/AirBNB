from rest_framework import serializers
from .models import Users
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_pic = serializers.ImageField(required=False, allow_null=True)  

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'role', 'date_joined', 'password', 'profile_pic']
        read_only_fields = ['id', 'date_joined']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.profile_pic:
            rep['profile_pic'] = instance.profile_pic.url  # ✅ full Cloudinary URL
        return rep

    def create(self, validated_data):
        role = validated_data.get('role', 'GU')
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        user.is_staff = (role == "HO")
        user.save()
        return user