from django.urls import path
from . import views

urlpatterns = [
   path('users/', views.user_create_list, name="users"),
   path('users/<str:pk>/', views.user_retrieve_update_delete),
   path('verify-email/', views.user_account_activation),
   path('generate-code/', views.generate_code_view),
   path('forgot-password/', views.forgot_password_view),

   # <==========================> Start Tasks Urls <==========================
   path('tasks/', views.task_create_list, name="tasks"),
   path('tasks/<str:pk>/', views.task_retrieve_update_delete),
]
