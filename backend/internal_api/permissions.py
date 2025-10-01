# internal_api/permissions.py
from rest_framework import permissions
from django.conf import settings

class IsInternalService(permissions.BasePermission):
    """
    Custom permission to only allow access if a specific internal API key is provided.
    """
    def has_permission(self, request, view):
        return request.headers.get('X-Internal-API-Key') == settings.INTERNAL_API_SECRET_KEY