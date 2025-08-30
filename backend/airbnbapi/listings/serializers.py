from rest_framework import serializers
from .models import HotelsListing, HotelImages, Location, RoomList , Review


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "city", "state", "country" , "lat","lon"]


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomList
        fields = ["id", "bedroom", "bathroom", "beds", "guest", "booked_from", "booked_to", "is_reserved"]


class HotelImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = HotelImages
        fields = ["id", "url"]

    def get_url(self, obj):
        return obj.image.url if obj.image else None
    


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "hotel","user", "rating" ,"cleanliness" , "location","service", "comment", "created_at"]
        read_only_fields = ['hotel']
    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email,
            "role": getattr(obj.user, "role", None),
        }

    def create(self, validated_data):
        # DRF will pass hotel and user from serializer.save()
        return Review.objects.create(**validated_data)


class HotelsListingSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
    location = LocationSerializer()
    rooms = RoomSerializer(many=True)  # ✅ allow nested input
    host = serializers.SerializerMethodField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = HotelsListing
        fields = [
            "id", "title", "description", "multiple_rooms",
            "rooms", "location", "address",
            "price_per_night", "offersOrExtras","reviews",
            "created_at", "updated_at",
            "host", "images"
        ]
        read_only_fields = ["created_at", "updated_at", "host", "images"]

    def get_host(self, obj):
        host = getattr(obj, "host_id", None)
        if not host:
            return None
        return {
            "id": host.id,
            "username": getattr(host, "username", None),
            "email": getattr(host, "email", None),
            "role": getattr(host, "role", None),
        }

    def create(self, validated_data):
        rooms_data = validated_data.pop("rooms", [{"bedroom":2,"bathroom":2,"beds":4 , "guest":4}])
        location_data = validated_data.pop("location")

        # ✅ handle location
        if isinstance(location_data, dict):
            location, _ = Location.objects.get_or_create(**location_data)
        else:
            location = location_data

        hotel = HotelsListing.objects.create(location=location, **validated_data)

        # ✅ handle rooms (create each)
        for room_data in rooms_data:
            if isinstance(room_data, dict):
                room_obj = RoomList.objects.create(**room_data)
                hotel.rooms.add(room_obj)
            elif isinstance(room_data, int):
                try:
                    room_obj = RoomList.objects.get(pk=room_data)
                    hotel.rooms.add(room_obj)
                except RoomList.DoesNotExist:
                    return serializers.ValidationError("Those Rooms are not available.")

        return hotel

    def update(self, instance, validated_data):
        rooms_data = validated_data.pop("rooms", [{"bedroom":2,"bathroom":2,"beds":4 , "guest":4}])
        location_data = validated_data.pop("location", None)

        # ✅ update location
        if isinstance(location_data, dict):
            location, _ = Location.objects.get_or_create(**location_data)
            instance.location = location
        elif isinstance(location_data, int):
            try:
                instance.location = Location.objects.get(pk=location_data)
            except Location.DoesNotExist:
                return serializers.ValidationError("The Location is not available.")

        # ✅ update hotel fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # ✅ update rooms
        if rooms_data:
            instance.rooms.clear()
            for room_data in rooms_data:
                if isinstance(room_data, dict):
                    room_obj = RoomList.objects.create(**room_data)
                    instance.rooms.add(room_obj)
                elif isinstance(room_data, int):
                    try:
                        room_obj = RoomList.objects.get(pk=room_data)
                        instance.rooms.add(room_obj)
                    except RoomList.DoesNotExist:
                        return serializers.ValidationError("Those Room's are not available.")

        instance.save()
        return instance


