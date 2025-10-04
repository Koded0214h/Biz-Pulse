from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.http import HttpResponse
from django.contrib.auth import get_user_model
import requests
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

@csrf_exempt
def register_test_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        business_name = request.POST.get("business_name")

        if not (username and password):
            return HttpResponse("Username and password are required", status=400)

        if User.objects.filter(username=username).exists():
            return HttpResponse("User already exists", status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            business_name=business_name
        )

        return HttpResponse(f"✅ User {user.username} registered successfully!")

    return HttpResponse("""
        <h2>Register Test User</h2>
        <form method='POST'>
            <label>Username:</label><br>
            <input name='username' /><br><br>
            <label>Email:</label><br>
            <input name='email' type='email' /><br><br>
            <label>Password:</label><br>
            <input name='password' type='password' /><br><br>
            <label>Business Name:</label><br>
            <input name='business_name' /><br><br>
            <button type='submit'>Register</button>
        </form>
    """)


@csrf_exempt
def login_test_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Point this to your deployed or local JWT login endpoint
        api_url = request.build_absolute_uri("/api/v1/auth/login/")

        try:
            response = requests.post(api_url, json={"username": username, "password": password})
            if response.status_code == 200:
                data = response.json()
                return HttpResponse(f"""
                    <h2>✅ Login Successful!</h2>
                    <p><strong>Access Token:</strong></p>
                    <textarea rows='4' cols='80'>{data.get("access")}</textarea><br><br>
                    <p><strong>Refresh Token:</strong></p>
                    <textarea rows='4' cols='80'>{data.get("refresh")}</textarea><br><br>
                    <p><strong>User:</strong> {data.get("user", {}).get("username")}</p>
                """)
            else:
                return HttpResponse(f"<h3>❌ Login failed:</h3><pre>{response.text}</pre>", status=response.status_code)
        except Exception as e:
            return HttpResponse(f"<h3>Error connecting to API:</h3><pre>{str(e)}</pre>", status=500)

    return HttpResponse("""
        <h2>Login Test Page</h2>
        <form method='POST'>
            <label>Username:</label><br>
            <input name='username' /><br><br>
            <label>Password:</label><br>
            <input name='password' type='password' /><br><br>
            <button type='submit'>Login</button>
        </form>
    """)