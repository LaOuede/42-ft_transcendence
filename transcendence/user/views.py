
from user.models import Profile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProfileSerializer
from rest_framework.generics import get_object_or_404

class ProfileCreate(APIView):
    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileDelete(APIView):
    def get_profile(self, profile_id):
        return get_object_or_404(Profile, id=profile_id)

    def get(self, request, profile_id):
        profile = self.get_profile(profile_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    def delete(self, request, profile_id):
        try:
            profile = Profile.objects.get(id=profile_id)
            profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

class ProfileGetOne(APIView):
    def get(self, request, profile_id):
        try:
            profile = Profile.objects.get(id=profile_id)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

class ProfileGetAll(APIView):
     def get(self, request):
        profiles = Profile.objects.all()
        if not profiles:
            return Response({"detail": "No profiles found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

class ProfileUpdate(APIView):
    def get_profile(self, profile_id):
        return get_object_or_404(Profile, id=profile_id)

    def get(self, request, profile_id):
        profile = self.get_profile(profile_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request, profile_id):
        profile = self.get_profile(profile_id)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)