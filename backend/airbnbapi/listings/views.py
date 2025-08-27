from rest_framework import generics, status , permissions ,viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import HotelsListing, HotelImages , Review
from .serializers import HotelsListingSerializer, HotelImageSerializer , ReviewSerializer
from .permissions import IsHostOrReadOnly, IsListingOwner




class ListingListCreateView(generics.ListCreateAPIView):
    queryset = HotelsListing.objects.select_related("location", "host_id").prefetch_related("rooms", "images")
    serializer_class = HotelsListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsHostOrReadOnly]

    def perform_create(self, serializer):
        # attach the currently logged-in user as host (field is host_id)
        serializer.save(host_id=self.request.user)

class ListingDetailView(generics.RetrieveUpdateAPIView):
    queryset = HotelsListing.objects.select_related("location", "host_id").prefetch_related("rooms", "images")
    serializer_class = HotelsListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsHostOrReadOnly, IsListingOwner]

class ListingImageUploadView(generics.CreateAPIView):

    serializer_class = HotelImageSerializer
    permission_classes = [IsAuthenticated, IsHostOrReadOnly, IsListingOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_listing(self):
        return get_object_or_404(HotelsListing, pk=self.kwargs.get("pk"))

    def check_object_permissions(self, request, obj):
        # reuse owner check on the listing
        for permission in self.permission_classes:
            if hasattr(permission, 'has_object_permission'):
                if not permission().has_object_permission(request, self, obj):
                    self.permission_denied(request, message=getattr(permission, 'message', None))
        return True

    def post(self, request, *args, **kwargs):
        listing = self.get_listing()

        # ensure user is host + owner
        self.check_object_permissions(request, listing)

        files = request.FILES.getlist("image")
        if not files:
            return Response({"detail": "No files found in 'image'."}, status=status.HTTP_400_BAD_REQUEST)

        created = []
        for f in files:
            img = HotelImages.objects.create(hotel=listing, image=f)  # upload to Cloudinary via storage
            created.append(HotelImageSerializer(img).data)

        return Response({"uploaded": created}, status=status.HTTP_201_CREATED)


class ReviewListCreateView(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        hotel_id = self.kwargs["pk"]
        return Review.objects.filter(hotel_id=hotel_id).select_related("user")

    def perform_create(self, serializer):
        hotel_id = self.kwargs.get("pk")  # hotel id from URL
        hotel = HotelsListing.objects.get(pk=hotel_id)
        serializer.save(user=self.request.user, hotel=hotel)