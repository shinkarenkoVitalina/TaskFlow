from django.shortcuts import render, redirect
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib import messages

from . import forms

def mainpage(request):
    return render(request, 'main/main_page.html')

class RegisterUser(CreateView):
    form_class = forms.RegisterUserForm
    template_name = 'main/reg_user.html'
    success_url = reverse_lazy('workspace')

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('workspace')

class LoginUser(LoginView):
    form_class = forms.UserAuthForm
    template_name = 'main/aut_user.html'

    def get_success_url(self):
        return reverse_lazy('workspace')
