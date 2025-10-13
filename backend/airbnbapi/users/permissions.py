from rest_framework import permissions

class IsSuperUserOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            
            if request.user.is_superuser:
                
                return True
            
            return request.method in permissions.SAFE_METHODS
        
        
        return False
    
    
class IsSuperUser(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            if request.user.is_superuser:
                return True
            
            return False
        
        
        return False