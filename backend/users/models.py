from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.

class User(AbstractUser):

    business_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(
        max_length=50,
        choices=[("owner", "Owner"), ("admin", "Admin"), ("staff", "Staff")],
        default="owner"
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    
    is_verified = models.BooleanField(default=False)   
    receive_alerts = models.BooleanField(default=True)
    
    groups = models.ManyToManyField(Group, related_name="users_groups")
    user_permissions = models.ManyToManyField(Permission, related_name="users_permissions")

    def __str__(self):
        return f"{self.username} ({self.business_name})"