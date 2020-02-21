from django.db import models
from django.utils.translation import ugettext_lazy as _
from bson.objectid import ObjectId

# Feedback database model


class Feedback(models.Model):

    user = models.CharField(max_length=255, default="Anonymous")
    content = models.TextField()
    type = models.CharField(max_length=255)
    time_stamp = models.DateTimeField()
