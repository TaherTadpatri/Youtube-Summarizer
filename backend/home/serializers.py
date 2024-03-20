# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Transcript


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists.")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")
        
        return data

    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user




class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = ['id', 'video_id', 'chapter_title', 'transcript_text']
