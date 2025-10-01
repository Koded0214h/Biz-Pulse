import os
import django
import sys

# Set DJANGO_SETTINGS_MODULE environment variable if not already set
# Replace 'backend.settings' with the actual path to your settings file if different
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') 
django.setup()

from django.contrib.auth import get_user_model

# --- Configuration ---
# Fetch credentials from environment variables
USERNAME = os.environ.get('DJANGO_SUPERUSER_USERNAME')
EMAIL = os.environ.get('DJANGO_SUPERUSER_EMAIL')
PASSWORD = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

# --- Execution ---
User = get_user_model()

if not all([USERNAME, EMAIL, PASSWORD]):
    print("WARNING: Superuser environment variables (USERNAME, EMAIL, PASSWORD) are not fully set. Skipping superuser creation.")
    # Exit gracefully without causing the deployment to fail
    sys.exit(0)

try:
    if User.objects.filter(is_superuser=True).exists():
        print("Superuser already exists. Skipping creation.")
        
    elif User.objects.count() == 0:
        # If no users exist (initial deploy), create the superuser
        print(f"Creating superuser '{USERNAME}'...")
        User.objects.create_superuser(
            username=USERNAME,
            email=EMAIL,
            password=PASSWORD
        )
        print("Superuser created successfully.")
        
    else:
        # Handle cases where users exist but no superuser is defined, 
        # though usually one should be created first.
        print("Non-superuser accounts found, but no superuser. Skipping automatic creation.")

except Exception as e:
    # Log any database or creation errors
    print(f"ERROR during superuser creation: {e}", file=sys.stderr)
    # Note: We exit with 0 (success) so the deployment continues, but the error is visible.
    sys.exit(0)
