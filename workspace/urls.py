from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.temp, name='workspace'),
    path('logout', views.logout_user, name='logout'),
    path('create_list', views.create_list, name='create_list'),
    path('delete_el/<str:el_type>/<int:el_id>', views.delete_el, name='delete_el'),
    path('create_el/<str:el_type>/<str:parent_type>/<int:parent_id>', views.create_el, name="create_el")
]