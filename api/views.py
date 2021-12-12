"""
アプリケーション全体のviewsモジュール
"""

# ------------------------------------------------------------------------
# 標準ライブラリのインポート
# ------------------------------------------------------------------------
from django.shortcuts import render
from django.contrib.auth.models import User

# ------------------------------------------------------------------------
# third party製ライブラリのimport
# ------------------------------------------------------------------------
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework import viewsets

# ------------------------------------------------------------------------
# 自作モジュールのインポート
# ------------------------------------------------------------------------
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from .ownpermissions import ProfilePermission

# viewsets.ModeViewSAetを継承するとCRUD機能が全てデフォルトで使える
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (ProfilePermission,)
    
class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user
    
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
