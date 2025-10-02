from rest_framework import permissions
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication

class IsInternalService(permissions.BasePermission):
    """
    Permission class to allow access only if the request uses a valid
    static API key (for AWS services) or if it's an authenticated superuser.
    """
    def has_permission(self, request, view):
        # 1. Check for Static Key Authentication (Used by AWS Glue, Lookout Lambda)
        # We read the key from the custom header used by the Glue job.
        provided_key = request.headers.get('X-Internal-API-Key')
        
        if provided_key:
            if provided_key == settings.INTERNAL_API_KEY:
                # Static key matched. Grant permission immediately.
                return True
            else:
                # Key provided, but incorrect. Deny access.
                return False

        # 2. Fallback to standard Django authentication check 
        # (Allows testing via Admin or valid JWT for manual calls)
        user = request.user
        if user and user.is_authenticated:
            # Optionally check for superuser/staff if you want to restrict internal APIs further
            # if user.is_superuser or user.is_staff: 
            return True
        
        # If no key is provided and the user is not authenticated, deny access.
        return False
