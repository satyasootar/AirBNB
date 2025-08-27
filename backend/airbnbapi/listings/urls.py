from rest_framework.routers import DefaultRouter
from django.urls import path , include
from listings import views

router = DefaultRouter()
router.register(r'', views.ReviewListCreateView)


urlpatterns = [
    path("",views.ListingListCreateView.as_view(), name="listing-list"),
    path("<int:pk>/", views.ListingDetailView.as_view(), name="listing-detail"),
    path("<int:pk>/images/", views.ListingImageUploadView.as_view(), name="listing-image-upload"),
    path("<int:pk>/reviews/",  include(router.urls)),

]
