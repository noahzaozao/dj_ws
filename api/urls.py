from django.urls import path

from . import views

urlpatterns = [
    path('login', views.APILoginView.as_view(), name='login'),
]
