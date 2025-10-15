from rest_framework.authentication import BaseAuthentication
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class AdminAuthentication(BaseAuthentication):
    
    def authenticate(self, request):
        
        email = request.data.get("email")  or request.query_params.get("email")
        password = request.data.get("password")  or request.query_params.get("password")
        
        if not email or not password:
            return None
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid email or password.")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password.")

        if not user.is_superuser:
            raise AuthenticationFailed("You do not have admin access.")

        return (user, None)