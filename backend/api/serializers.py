from rest_framework import serializers
from . import models
from api.models import User, Task
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .utlis import send_activation_email


# ====================================> Start User Serializers <=====================================


class UsersSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
    
    def validate_password(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Password was very short.")

        if value.isdigit():
            raise serializers.ValidationError("Password must contain characters")

        return value


    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        send_activation_email(user)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'identifier'

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError("Both fields are required.")

        
        user = User.objects.filter(email=identifier).first() or \
               User.objects.filter(username=identifier).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        data = {}
        refresh = self.get_token(user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class ForgotPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password']


    def validate_password(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Password was very short.")

        if value.isdigit():
            raise serializers.ValidationError("Password must contain characters")

        return value

# ====================================> End User Serializers <=====================================


# ====================================> Start Task Serializers <=====================================


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'priority', 'status', 'created_at']
