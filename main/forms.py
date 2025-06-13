from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label='Введите ваше имя', widget = forms.TextInput(attrs={'class':'input-form'}))
    password1 = forms.CharField(label='Придумайте пароль', widget = forms.TextInput(attrs={'class':'input-form'}))
    password2 = forms.CharField(label='Повторите введенный пароль', widget = forms.TextInput(attrs={'class':'input-form'}))
    email = forms.CharField(label='Введите вашу почту', widget = forms.TextInput(attrs={'class':'input-form'}))
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class UserAuthForm(AuthenticationForm):
    username = forms.CharField(label='Введите ваше имя', widget=forms.TextInput(attrs={'class': 'input-form'}))
    email = forms.CharField(label='Введите вашу почту', widget=forms.EmailInput(attrs={'class': 'input-form'}))
    password = forms.CharField(label='Введите пароль', widget=forms.PasswordInput(attrs={'class': 'input-form'}))
