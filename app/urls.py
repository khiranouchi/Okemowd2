from django.urls import path

from . import views


urlpatterns = [
    path('', views.main, name='main'),
    path('<int:song_id>/', views.main_entry, name='main_entry'),
]
