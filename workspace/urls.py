from django.urls import path, include
from . import views

urlpatterns = [
    path('logout', views.logout_user, name='logout'),
    path('create_workspace', views.create_workspace, name='create_workspace'),
    path('delete_el/<str:el_type>/<int:el_id>/<int:desk_id>', views.delete_el, name='delete_el_desk'),
    path('create_el/<str:el_type>/<str:parent_type>/<int:parent_id>/<int:desk_id>', views.create_el,
         name="create_el_desk"),
    path('delete_el/<str:el_type>/<int:el_id>', views.delete_el, name='delete_el'),
    path('create_el/<str:el_type>/<str:parent_type>/<int:parent_id>', views.create_el, name="create_el"),
    path('profile', views.profile, name='profile'),
    path('desk/<int:desk_id>', views.desk_view, name="desk"),
    path('update_deadline/<int:card_id>/', views.update_deadline, name='update_deadline'),
    path('desk_settings/<int:desk_id>/', views.temp_wp_page, name='desk_settings')
]