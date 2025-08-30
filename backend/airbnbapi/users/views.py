from django.shortcuts import render , redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Users
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt import authentication

User = get_user_model()
# Create your views here.
def home(request):
    return HttpResponse("Welcome to the HomePage")

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Simple Custom Authentication for Login
def Authenticate(email , password):
    try:
        check = User.objects.filter(email=email).exists()
        if check:
            user = User.objects.get(email=email )
            if user.check_password(password):
                
                return user
    except not check :
        return None

class LoginView(APIView):
    def post(self, request):
        password = request.data.get("password")
        email = request.data.get("email")
        user=Authenticate(email , password)

        if user:
            refresh = RefreshToken.for_user(user)
                
            return Response({
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
    



class SelfView(APIView):
    authentication_classes = [authentication.JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
