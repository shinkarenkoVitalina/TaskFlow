from django import forms
from . import models

class AddList(forms.ModelForm):
    title = forms.CharField(label='Название', widget=forms.TextInput(attrs={'class': 'add-list-input', 'placeholder': 'Введите название списка...',}))
    class Meta:
        model = models.List
        fields = ['title']

class AddCard(forms.ModelForm):
    title = forms.CharField(label='Название', widget=forms.TextInput(attrs={'class': 'add-card-input', 'placeholder': 'Введите название карточки...',}))
    class Meta:
        model = models.Card
        fields = ['title']

class AddCheckList(forms.ModelForm):
    title = forms.CharField(label='Название', widget=forms.TextInput(attrs={'class': 'add-card-input', 'placeholder': 'Введите название чек-листа...',}))
    class Meta:
        model = models.List
        fields = ['title']

class AddClCard(forms.ModelForm):
    title = forms.CharField(label='Название', widget=forms.TextInput(attrs={'class': 'add-card-input', 'placeholder': 'Введите описание задачи...',}))
    class Meta:
        model = models.Card
        fields = ['title']