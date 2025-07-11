
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('workspace/', include('workspace.urls')),
    path('api/', include('workspace.api_urls')),
]
