import string
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import random

#### User Model ####


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        default_username = self.generate_unique_username(email)
        extra_fields.setdefault("username", default_username)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def generate_unique_username(self, email):
        base_username = email.split('@')[0]
        username = base_username
        while User.objects.filter(username=username).exists():
            random_suffix = ''.join(random.choices(string.digits, k=4))
            username = base_username + random_suffix
        return username

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50)
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.name

    # Add related_name argument to avoid clashes
    # with the built-in User model's reverse accessor
    # for groups
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_users'  # Change 'custom_users' to your desired related name
    )

    # Add related_name argument to avoid clashes
    # with the built-in User model's reverse accessor
    # for user_permissions
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_users'  # Change 'custom_users' to your desired related name
    )

#### Conversation Model ####


class Conversation(models.Model):
    participants = models.ManyToManyField(
        User,
        related_name="conversation",
        limit_choices_to=models.Q(groups__isnull=True)
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id}"

#### Message Model ####


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} by {self.sender.name} in {self.conversation}"
