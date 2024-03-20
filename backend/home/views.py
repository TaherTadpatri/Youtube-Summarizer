from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from home.serializers import UserSerializer
from django.contrib.auth import authenticate
from youtube_transcript_api import YouTubeTranscriptApi
import re
from transformers import T5Tokenizer, T5ForConditionalGeneration
from transformers import pipeline
from datetime import timedelta
import requests
from .models import Transcript
import json
import os
from home.serializers import TranscriptSerializer
from django.views.decorators.csrf import csrf_exempt
import ollama


@api_view(['POST'])
def user_registration(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


def extract_video_id(url):
    pattern = r'(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    else:
        return None


@api_view(['POST', 'GET'])
def video_transcript(request):
    if request.method == 'POST' or request.method == 'GET':
        video_url = request.data.get('url')
        video_id = extract_video_id(video_url)
        if video_id is None:
            return Response({"Error": "Please provide a valid YouTube URL"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(
                    video_id, languages=['en'])
                transcript_text = ' '.join(item['text'] for item in transcript)
                result = {"transcript": transcript_text}
                summarizer = pipeline("summarization", model="t5-base")
                summary = summarizer(
                    transcript_text, max_length=1000, min_length=30, do_sample=False)
                result = {'summarization': summary}
                print(len(summary))
                return Response(result, status=status.HTTP_200_OK)
            except KeyError:
                return Response({"Error": "Transcript not found for the provided video"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"Error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['POST'])
def question(request):
    if request.method == 'POST':
        question = request.data.get('question')
        print(question)
        response = ollama.chat(model='llama2',
                               messages=[{
                                   'role': 'user',
                                   'content': question,
                                   'formate': 'json',
                                   'stream': True,
                               },])
        response = {'response': response}

        return Response(response, status=status.HTTP_200_OK)


def summarize_text(input_text):
    tokenizer = T5Tokenizer.from_pretrained('t5-small')
    model = T5ForConditionalGeneration.from_pretrained('t5-small')
    inputs = tokenizer("summarize: " + input_text,
                       return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(
        inputs['input_ids'], num_beams=4, min_length=30, max_length=100, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    summary = summarize_text(input_text)
    return summary


def get_chapters(url):
    regex = (r"{\"macroMarkersListItemRenderer\":{\"title\":{\"simpleText\":\"(?P<chapter>[^\"]*)\"},"
             r"\"timeDescription\":{\"simpleText\":\"(?P<time>[^\"]*)\"")
    url = url.strip('"')
    response = requests.get(url)
    matches = re.finditer(regex, response.text)
    chapter_dict = {match.group('time'): match.group('chapter')
                    for match in matches}
    return chapter_dict


def time_to_seconds(time_str):
    parts = time_str.split(':')
    if len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 3600 + minutes * 60 + seconds
    elif len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes * 60 + seconds
    else:
        raise ValueError("Invalid time format")


def store_transcript(video_id, chapters):
    for time, chapter_title in chapters.items():
        try:
            start_time_seconds = time_to_seconds(time)
            transcript = YouTubeTranscriptApi.get_transcript(
                video_id, languages=['en'])
            chapter_transcript = "\n".join(
                part['text'] for part in transcript if part['start'] >= start_time_seconds)
            Transcript.objects.create(
                video_id=video_id, chapter_title=chapter_title, transcript_text=chapter_transcript)
        except Exception as e:
            pass


def getduartion(time, chapters):
    for i, chapter_time in enumerate(chapters):
        if chapter_time == time:
            if i < len(chapters) - 1:
                next_chapter_time = list(chapters.keys())[i+1]
                duration = abs(time_to_seconds(
                    next_chapter_time) - time_to_seconds(chapter_time))
                return duration
            else:
                return time_to_seconds(time)
    return None


@api_view(['POST'])
def get_transcript_by_chapters(request):
    video_url = request.data.get('youtube_url')
    print(video_url)
    video_id = extract_video_id(video_url)
    chapters = get_chapters(video_url)

    transcript_by_chapters = {}
    try:
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id, languages=['en'])
    except Exception as e:
        return Response({'error': f"Error fetching transcript: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    transcript_intervals = {}
    for part in transcript:
        start_time = part['start']
        end_time = start_time + part['duration']
        transcript_intervals[(start_time, end_time)] = part['text']

    transcript_by_chapters = {}
    for time, chapter_title in chapters.items():
        start_time_seconds = time_to_seconds(time)
        end_time_seconds = start_time_seconds + getduartion(time, chapters)
        chapter_transcript = [text for (start, end), text in transcript_intervals.items() if start >= start_time_seconds and end <= end_time_seconds]
        transcript_by_chapters[chapter_title] = chapter_transcript
        Transcript.objects.create(video_id=video_id, chapter_title=chapter_title, transcript_text=chapter_transcript)
    print(chapters)
    return Response(chapters, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def summary(request):
    if request.method == 'POST' or request.method == 'GET':
        videoId = request.data.get('videoId')
        chapterName = request.data.get('title')
        objtext = Transcript.objects.filter(video_id=videoId, chapter_title=chapterName).first()

        if objtext:
            text = objtext.transcript_text
            rawtext=' your are given the youtube video chapter name explain the concepts of '+ chapterName +' with example if necessary and code snippet'
            print(rawtext)
            response = ollama.chat(model='llama2',
                                   messages=[{
                                       'role': 'user',
                                       'content': rawtext,
                                       'formate': 'json',
                                       'stream': True,
                                   },])
            response = {'response': response}
            response_data = {"summary": response}

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No transcript found for the specified criteria."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"message": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def ollamaTest(request):
    if request.method == 'POST':
        question = request.data.get('question')
        response = ollama.chat(model='llama2',
                               messages=[{
                                   'role': 'user',
                                   'content': question,
                                   'formate': 'json',
                               },])
        response = {'response': response}
        return Response(response, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'error loading'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
