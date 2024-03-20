from django.db import models

class Transcript(models.Model):
    video_id = models.CharField(max_length=100)
    chapter_title = models.CharField(max_length=255)
    transcript_text = models.TextField()

    def __str__(self):
        return f"Transcript for video {self.video_id}, chapter: {self.chapter_title}"
