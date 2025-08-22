
from django.urls import path , include
from users import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name="register"),
    path('login/', views.LoginView.as_view(), name="login"),
    path('me/',views.SelfView.as_view(), name="self"),
]
