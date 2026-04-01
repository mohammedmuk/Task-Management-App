import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import AccountActivation, UserChangePassword


def generate_code_token():
    return str(random.randint(100000,999999))


def generate_code_expiration():
    return timezone.now() + timedelta(minutes=10)


def send_activation_email(user):
    profile_activation = AccountActivation.objects.create(user=user, code = generate_code_token(), code_expiration_date = generate_code_expiration())
    
    profile_activation.save()

    send_mail(        
        subject="Activate Your Account",
        message=f"Your activation code: {profile_activation.code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[profile_activation.user.email],
        fail_silently=False
    )


def send_forgot_password_email(user):
    reset_password = UserChangePassword.objects.create(user=user, code=generate_code_token(), code_expiration_date=generate_code_expiration())

    reset_password.save()

    send_mail(        
        subject="Reset Your Password",
        message=f"Your changing password code: {reset_password.code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[reset_password.user.email],
        fail_silently=False
    )