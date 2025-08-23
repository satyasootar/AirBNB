from rest_framework.permissions import BasePermission



class IsBookingOwnerOrHost(BasePermission):

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        # owner of the booking
        if obj.user_id == request.user.id:
            return True
        # host of the listing (HotelsListing.host_id is the FK field name)
        return getattr(obj.listing, "host_id_id", None) == request.user.id