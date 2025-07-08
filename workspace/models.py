from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from django.db import models


class WorkSpace(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Рабочее пространство'
        verbose_name_plural = 'Рабочие пространства'


class Desk(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(WorkSpace, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Доска'
        verbose_name_plural = 'Доски'


class List(models.Model):
    title = models.CharField(max_length=255)
    parent = models.ForeignKey(Desk, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Список'
        verbose_name_plural = 'Списки'


class Card(models.Model):
    title = models.CharField(max_length=255)
    create = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField(blank=True, null=True)
    parent = models.ForeignKey('List', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        if self.deadline:
            return timezone.now() > self.deadline
        return False

    class Meta:
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'


class CheckList(models.Model):
    title = models.CharField(max_length=255)
    parent = models.ForeignKey('Card', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Чеклист'
        verbose_name_plural = 'Чеклисты'


class CheckListCard(models.Model):
    title = models.TextField()
    to_check = models.BooleanField(default=False)
    parent = models.ForeignKey('CheckList', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Элемент чеклиста'
        verbose_name_plural = 'Элементы чеклистов'