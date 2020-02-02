from django.http import Http404

from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .serializers import *
from .models import Feedback

# Submit Feedback API
class FeedbackAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = FeedbackSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # serializer to check if valid then submit feedback to the database.
        serializer.is_valid(raise_exception=True)
        serializer.save()

        feedback = serializer.validated_data
        return Response({
            "feedback": FeedbackSerializer(
                feedback,
                context=self.get_serializer_context()
            ).data
        })


