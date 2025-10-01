# internal_api/permissions.py
from rest_framework import permissions

class IsInternalService(permissions.BasePermission):
    """
    Custom permission to allow access only to the designated internal service 
    OR to superusers/admins (for testing).
    """
    def has_permission(self, request, view):
        # Allow superusers/admins access for testing and debugging internal tools
        if request.user and request.user.is_authenticated:
            # Check for Django's built-in superuser/staff flag
            if request.user.is_superuser or request.user.is_staff:
                return True
            
            # Check for your custom 'role' field (if it exists on your User model)
            if hasattr(request.user, 'role') and request.user.role == 'admin':
                return True

        # Fallback to the original internal service logic (if it exists)
        # return getattr(request.user, 'is_internal_service', False) 

        # If the user is not an admin/superuser/staff, or not the designated internal user, deny access.
        return False