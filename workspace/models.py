from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django.db import models

# Create your models here.

class List(models.Model):
    title = models.CharField(max_length=255)
    list_user = models.ForeignKey(User, on_delete=models.CASCADE)


class Card(models.Model):
    title = models.CharField(max_length=255)
    create = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField(blank=True, null=True)
    parent = models.ForeignKey('List', on_delete=models.CASCADE)


class CheckList(models.Model):
    title = models.CharField(max_length=255)
    parent = models.ForeignKey('Card', on_delete=models.CASCADE)


class CheckListCard(models.Model):
    title = models.TextField()
    to_check = models.BooleanField(default=False)
    parent = models.ForeignKey('CheckList', on_delete=models.CASCADE)