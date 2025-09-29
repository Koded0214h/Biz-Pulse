from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# -------------------------
# General User Serializer
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "username", "email", "business_name", 
            "role", "phone_number", "country", "industry", 
            "is_verified", "receive_alerts"
        ]


# -------------------------
# Register Serializer
# -------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username", "email", "business_name", 
            "role", "phone_number", "country", "industry", 
            "is_verified", "receive_alerts", "password"
        ]

    def create(self, validated_data):
        # Extract password before popping other fields
        password = validated_data.pop("password")
        user = User(**validated_data)   # include business_name, role, etc.
        user.set_password(password)     # properly hash password
        user.save()
        return user


# -------------------------
# Login Serializer
# -------------------------
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user
