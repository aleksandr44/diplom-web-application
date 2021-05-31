import json

import dateutil.parser as dt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets

from .models import DocFormat, Fields, Student, Task, TaskType, Teacher
from .serializers import (
    DocFormatSerializer,
    FieldsSerializer,
    StudentSerializer,
    TaskSerializer,
    TaskTypeSerializer,
)
from .utils import check_format_docx, doc2pdf, style_creator


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


@csrf_exempt
def login(request):
    post_data = json.loads(request.body.decode("utf-8"))
    user_type = post_data.get("userType")
    data = {}

    if user_type:
        user = User.objects.create_user(
            username=post_data["login"], password=post_data["password"]
        )
        if user_type == 'is_teacher':
            Teacher.objects.create(user=user)
            data["is_teacher"] = True
        else:
            Student.objects.create(user=user)
            data["is_student"] = True

        data["user_id"] = user.id
        data["status"] = 200

    else:
        user = authenticate(username=post_data["login"], password=post_data["password"])

    if user:
        if Teacher.objects.filter(user=user).exists():
            data["is_teacher"] = True
        else:
            data["is_student"] = True

        data["user_id"] = user.id
        data["status"] = 200

        return JsonResponse(data)
    else:
        return HttpResponse(status=403)


@csrf_exempt
def file_recognizer(request):
    if request.FILES:
        file = request.FILES["params"]
        file_name = default_storage.save(file.name, file)
        task_id = request.POST.dict()["task_id"]
        task = Task.objects.get(id=task_id)
        doc_format = DocFormat.objects.get(id=task.rule_id)

        return check_format_docx(file_name, doc_format, task_id)
    else:
        return HttpResponse(status=400)


@csrf_exempt
def get_init_data(request):
    serializer = FieldsSerializer(Fields.objects.all(), many=True)

    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def get_initial_data_for_create_task(request):
    students = StudentSerializer(Student.objects.all(), many=True).data
    rules = DocFormatSerializer(DocFormat.objects.all(), many=True).data
    task_type = TaskTypeSerializer(TaskType.objects.all(), many=True).data

    return JsonResponse(
        {
            "students": students,
            "task_type": task_type,
            "rules": rules,
        }
    )


@csrf_exempt
def create_style(request):
    data = json.loads(request.body.decode("utf-8"))["styles"]
    style_creator(data)

    return HttpResponse(status=200)


@csrf_exempt
def create_task(request):
    post_data = request.POST.dict()
    rule = post_data["rule"]
    task_type = post_data["task_type"]
    deadline = dt.parse(post_data["deadline"].split("(")[0])
    user_id = post_data["user_id"]
    text = post_data["name"]
    students_in_group = post_data["students_in_group"].split(",")

    if request.FILES:
        example = request.FILES["params"]

    teacher = Teacher.objects.get(user_id=user_id)
    task = Task.objects.create(
        rule_id=rule,
        task_type_id=task_type,
        deadline=deadline,
        teacher=teacher,
        example=example,
        text=text,
    )

    path_file = doc2pdf(task.example.path, f"{task.example.path.split('.')[0]}.pdf")
    task.example_pdf = path_file
    task.save()
    task.students.add(*Student.objects.filter(id__in=students_in_group))

    return HttpResponse(status=200)


@csrf_exempt
def check_file_anonimous(request):
    post_data = request.POST.dict()
    d = json.loads(post_data["styles"])

    rule = style_creator(d)

    f = request.FILES["params"]
    file_name = default_storage.save(f.name, f)

    return check_format_docx(file_name, rule)
