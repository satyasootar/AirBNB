from rest_framework import serializers
from .models import Users
from django.contrib.auth.hashers import make_password



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Users
        fields = [
            'id', 'username', 'email', 'role', 'date_joined',
            'password', 'profile_pic'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            try:
                return obj.profile_pic.url   
            except:
                return str(obj.profile_pic)  
        return None

    def create(self, validated_data):
        role = validated_data.get('role', 'GU')
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        user.is_staff = (role == "HO")
        user.save()
        return user