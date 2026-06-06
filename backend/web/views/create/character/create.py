from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from web.models.character import Character, Voice
from web.models.user import UserProfile
from web.views.create.character.update import Res


class CreateCharacterView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            user_profile = UserProfile.objects.get(user=user)
            name = request.data.get('name').strip()
            profile = request.data.get('profile').strip()[:15000]
            photo = request.FILES.get('photo', None)
            background_image = request.FILES.get('background_image', None)
            voice_id = request.data.get('voice_id')

            if not name:
                return Res("用户名不能为空！")
            if not profile:
                return Res("用户简介不能为空！")
            if not photo:
                return Res("用户头像不能为空！")
            if not background_image:
                return Res("背景图片不能为空！")

            voice = Voice.objects.get(id=voice_id)

            Character.objects.create(
                author=user_profile,
                name=name,
                voice=voice,
                photo=photo,
                profile=profile,
                background_image=background_image,
            )

            return Res("success")
        except:
            return Res("系统异常，请稍后重试！")
