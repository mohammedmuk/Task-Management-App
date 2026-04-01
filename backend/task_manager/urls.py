from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import token_obtain_pair, token_verify, token_refresh
from api.views import CustomTokenObtainPairView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/<str:version>/', include('api.urls')),
    path('api/<str:version>/token/', CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('api/<str:version>/token/refresh/', token_refresh),
    path('api/<str:version>/token/verify/', token_verify),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional: Swagger UI display
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Optional: ReDoc UI display
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
