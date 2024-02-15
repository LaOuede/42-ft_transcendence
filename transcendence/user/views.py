from user.models import Profile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProfileSerializer

class ProfileCreate(APIView):
    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileDelete(APIView):
    def get(self, request, profile_id):
        try:
            profile = Profile.objects.get(id=profile_id)
            return Response({"detail": "Are you sure you want to delete this profile?"})
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, profile_id):
        try:
            profile = Profile.objects.get(id=profile_id)
            profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)