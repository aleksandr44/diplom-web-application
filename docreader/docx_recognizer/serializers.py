from rest_framework import serializers

from .models import DocFormat, Fields, Result, Student, Task, TaskType


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class FieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fields
        fields = "__all__"


class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = "__all__"


class DocFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocFormat
        fields = "__all__"
        depth = 3


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"
        depth = 2


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = "__all__"
        depth = 2
