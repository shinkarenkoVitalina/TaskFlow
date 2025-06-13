from django.urls import path
from . import views

urlpatterns = [
    path('main_page/', views.mainpage, name='mainpage'),
    path('auth/', views.LoginUser.as_view(), name='auth'),
    path('reg/', views.RegisterUser.as_view(), name='reg')
]