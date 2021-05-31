from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from .views import (
    TaskViewSet,
    check_file_anonimous,
    create_style,
    create_task,
    file_recognizer,
    get_init_data,
    get_initial_data_for_create_task,
    login,
)

router = routers.DefaultRouter()
router.register(r"tasks", TaskViewSet)

urlpatterns = [
    path("recognize_file/", file_recognizer),
    path("get_initial_data/", get_init_data),
    path("get_initial_data_for_create_task/", get_initial_data_for_create_task),
    path("create_style/", create_style),
    path("create_task/", create_task),
    path("check_file_anonimous/", check_file_anonimous),
    path("login/", login),
    path("", include(router.urls)),
]
