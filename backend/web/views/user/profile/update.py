from django.contrib.auth.models import User
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from web.models.user import UserProfile
from web.views.utils.photo import remove_old_photo


def Res(message):
    return Response({
        'result': message
    })

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            user_profile = UserProfile.objects.get(user=user)
            username = request.data.get('username').strip()
            profile = request.data.get('profile').strip()[:500]
            photo = request.FILES.get('photo', None)
            pre_profile = user_profile

            if not username:
                return Res('用户名不能为空！')
            if not profile:
                return Res('个人简介不能为空！')
            if username != user.username and User.objects.filter(username=username).exists():
                return Res('该用户名已存在！')
            if photo:
                user_profile.photo = photo
                remove_old_photo(photo)
            user_profile.profile = profile
            user_profile.update_time = now()
            user_profile.save()
            user.username = username
            user.save()

            return Response({
                'result': 'success',
                'user_id': user.id,
                'username': user.username,
                'profile': user_profile.profile,
                'photo': user_profile.photo.url,
            })
        except:
            return Res("系统异常，请稍后再试！")