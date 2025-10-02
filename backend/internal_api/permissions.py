from rest_framework import permissions
from django.conf import settings
# You might need to adjust how your JWT authentication is set up, but let's 
# focus on the raw header check for the static key.

class IsInternalService(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check 1: Static Key Authentication (for Glue/Trusted Services)
        # The client should send the key in the Authorization header: 
        # Authorization: Static <KEY_HERE>
        auth_header = request.headers.get('Authorization', '')

        if auth_header.startswith('Static '):
            # Extract the key part after 'Static '
            provided_key = auth_header.split(' ')[1].strip()

            if provided_key == settings.INTERNAL_API_KEY:
                # Log or set a marker if needed, but return True immediately
                return True

        # Check 2: Existing JWT/Admin Authentication (for manual testing or admin users)
        # This is where your previous JWT or admin check logic resides. 
        if request.user and request.user.is_authenticated:
            # Assuming this allows your admin test user to pass (as fixed earlier)
            if request.user.is_superuser or request.user.is_staff:
                return True

        # If neither check passes, deny access.
        return False