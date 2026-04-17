from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from web.models.character import Character
from web.views.create.character.update import Res


class RemoveCharacterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            character_id = request.data['character_id']
            Character.objects.filter(pk=character_id, author__user=request.user).delete()
            return Res("success")
        except:
            return Res("系统异常，请稍后重试！")
