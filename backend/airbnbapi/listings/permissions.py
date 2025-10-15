from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth import get_user_model

User = get_user_model()

def is_host(user):
    
    host_codes = {"HO", "host", "Host"}
    try:
        
        return user.is_authenticated and (getattr(user, "role", None) in host_codes or str(getattr(User.Role, "Host", "HO")) == getattr(user, "role", None))
    
    except Exception:
        return user.is_authenticated and getattr(user, "role", None) in host_codes

class IsHostOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return is_host(request.user)

class IsListingOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.host_id_id == request.user.id  

