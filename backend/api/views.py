from rest_framework import generics
from . import serializers
from api.models import User, Task, AccountActivation, UserChangePassword
from .mixins import UserQuerySetMixins
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework import status
from .utlis import send_activation_email, send_forgot_password_email


# ====================================> Start User Views <=====================================


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class CreateListUsersView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UsersSerializer
    permission_classes = []


    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        return qs.filter(id=self.request.user.id)


class RetrieveUpdateDeleteUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UsersSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        return qs.filter(id=self.request.user.id)

class UserAccountActivation(APIView):
    permission_classes = []
    def post(self, request, version):
        email = request.data.get('email')
        code = request.data.get('code')
        user = User.objects.filter(email=email).first()
        

        profile_activation = AccountActivation.objects.filter(user=user).last()

        if not user:
            return Response({"email" : "Incorrect Email."}, status.HTTP_404_NOT_FOUND)
        
        if not code:
            return Response({"code" : "This Field Is Required."})

        if profile_activation.code != code:
            return Response({"message" : "Invalid Activation Code."}, status.HTTP_400_BAD_REQUEST)
        
        if profile_activation.code_expiration_date < timezone.now():
            return Response({"message" : "Expired Activation Code."}, status.HTTP_400_BAD_REQUEST)
        
        user.is_active = True
        user.save()
        profile_activation.code_expiration_date = timezone.now()
        profile_activation.save()

        return Response({"message" : "Account Activated Successfully."}, status=status.HTTP_200_OK)

class GenerateCodeView(APIView):
    permission_classes = []
    def post(self, request, version):
        email = request.data.get('email')
        endpoint = request.data.get('endpoint')
        user = User.objects.filter(email=email).first()

        if not user:
          return Response({"message" : "User Not Found."}, status.HTTP_404_NOT_FOUND)
        
        if not endpoint:
            return Response({"endpoint" : "Required Value: account-activation | forgot-password"}, status.HTTP_400_BAD_REQUEST)

        if endpoint == 'account-activation':
            if user.is_active:
                return Response({"message" : "User Has Already Activated."}, status=status.HTTP_400_BAD_REQUEST)
    
            send_activation_email(user)
            return Response({"message" : "Activation Code Sended Successfully."})
        
        if endpoint == 'forgot-password':
            send_forgot_password_email(user)
            return Response({"message" : "Reset Password Code Sended Successfully."})
    
        return Response({"endpoint" : "Required Value: account-activation | forgot-password"}, status.HTTP_404_NOT_FOUND)

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='email',
            required=True,
            type=str,
            location=OpenApiParameter.QUERY
        ),
        OpenApiParameter(
            name='password',
            required=True,
            type=str,
            location=OpenApiParameter.QUERY
        ),
        OpenApiParameter(
            name='code',
            required=True,
            type=str,
            location=OpenApiParameter.QUERY
        ),
    ]
)
class ForgotPasswordView(APIView):
    permission_classes = []
    def patch(self, request, version):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        code = request.data.get('code')
        password = request.data.get('password')

        reset_password = UserChangePassword.objects.filter(user=user).last()

        if not user:
            return Response({"email" : "Incorrect Email."}, status=status.HTTP_404_NOT_FOUND)

        if not user.is_active:
            return Response({"message" : "Go And Activate Your account First."}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        if reset_password.code != code:
            return Response({"message" : "Invalid Activation Code."}, status.HTTP_400_BAD_REQUEST)
        
        if reset_password.code_expiration_date < timezone.now():
            return Response({"message" : "Expired Activation Code."}, status.HTTP_400_BAD_REQUEST)
        
    
        user_serializer = serializers.ForgotPasswordSerializer(data = request.data)


        if user_serializer.is_valid(raise_exception=True):
            user.set_password(password)
            user.save()
            reset_password.code_expiration_date = timezone.now()
            reset_password.save()
            return Response({"message" : "Success Setting Password."}, status=status.HTTP_200_OK)

            
user_create_list = CreateListUsersView.as_view()
user_retrieve_update_delete = RetrieveUpdateDeleteUserView.as_view()
user_account_activation = UserAccountActivation.as_view()
generate_code_view = GenerateCodeView.as_view()
forgot_password_view = ForgotPasswordView.as_view()


# ====================================> End User Views <=====================================


# ====================================> Start Tasks Views <=====================================


class CreateListTask(UserQuerySetMixins, generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = serializers.TaskSerializer


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(owner=user)

class RetrieveUpdateDeleteTaskView(UserQuerySetMixins, generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = serializers.TaskSerializer


task_create_list = CreateListTask.as_view()
task_retrieve_update_delete = RetrieveUpdateDeleteTaskView.as_view()


# ====================================> ENd Tasks Views <=====================================
