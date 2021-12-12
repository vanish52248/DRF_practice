"""
プロジェクト全体のURL設定
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    # apiアプリ(自作した)の中のurls.pyを見に行きなさいという設定
    path('api/', include('api.urls')),
    # obtain_auth_tokenを実行し、ユーザーネームとパスワードをPOSTするとトークンが返ってくる
    path('auth/', obtain_auth_token),
]
