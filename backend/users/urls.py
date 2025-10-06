from django.urls import path
from users.views import RegisterView, LoginView, ProfileView, LogoutView, register_test_view, login_test_view

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("auth/test-register/", register_test_view, name="test-register"),
    path("auth/test-login/", login_test_view, name="test-login"),
]
