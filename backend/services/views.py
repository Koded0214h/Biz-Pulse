from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage


# Create your views here.

class UploadDataView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save directly to S3
        file_name = default_storage.save(file_obj.name, file_obj)
        file_url = default_storage.url(file_name)

        return Response({
            "message": "File uploaded successfully!",
            "file_name": file_name,
            "file_url": file_url
        }, status=status.HTTP_201_CREATED)