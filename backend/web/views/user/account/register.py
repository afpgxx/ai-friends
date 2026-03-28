from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from web.models.user import UserProfile


class RegisterView(APIView):
    def post(self, request):
        try:
            username = request.data['username'].strip()
            password = request.data['password'].strip()
            confirm_password = request.data['confirm_password'].strip()
            if not username or not password:
                return Response({
                    'result': '用户名和密码不能为空!'
                })
            if User.objects.filter(username=username).exists():
                return Response({
                    'result': '该用户名已存在！'
                })
            if password != confirm_password:
                return Response({
                    'result': '两次密码输入不一致！'
                })

            user = User.objects.create_user(username=username, password=password)
            user_profile = UserProfile.objects.create(user=user)
            refresh = RefreshToken.for_user(user)
            response = Response({
                'result': 'success',
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'photo': user_profile.photo.url,  # 需要返回url
                'profile': user_profile.profile,
            })
            response.set_cookie(
                key='refresh_token',
                value=refresh,
                secure=True,
                httponly=True,
                samesite='Lax',
                max_age=86400 * 7,
            )
            return response

        except:
            return Response({
                'result': '系统异常，请稍后再试！'
            })