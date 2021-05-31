from django.contrib.auth.models import User
from django.db import models
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT


class Font(models.Model):
    BOLD = "b"
    ITALIC = "i"
    STANDARD = "st"
    BOLD_ITALIC = "bi"
    TYPES = [
        (BOLD, "Жирный"),
        (ITALIC, "Курсив"),
        (STANDARD, "Обычный"),
        (BOLD_ITALIC, "Полужирный курсив"),
    ]

    name = models.TextField(verbose_name="Наименование")
    type = models.CharField(choices=TYPES, verbose_name="Тип шрифта", max_length=2)
    size = models.IntegerField(verbose_name="Размер")

    def __str__(self):
        return (
            f"Шрифт: {self.name}, "
            f"Тип шрифта: {dict(self.TYPES)[self.type]}, "
            f"Размер шрифта: {self.size}, "
        )

    class Meta:
        verbose_name = "Шрифт"
        verbose_name_plural = "Шрифты"


class Paragraph(models.Model):
    line_spacing = models.FloatField(verbose_name="Межстрочный интервал")
    WD_PARAGRAPH_ALIGNMENT = WD_PARAGRAPH_ALIGNMENT
    LEFT = "LEFT"
    CENTER = "CENTER"
    RIGHT = "RIGHT"
    JUSTIFY = "JUSTIFY"
    TYPES = [
        (JUSTIFY, "По ширине"),
        (CENTER, "По центру"),
        (RIGHT, "По правому краю"),
        (LEFT, "По левому краю"),
    ]
    alignment = models.TextField(choices=TYPES, verbose_name="Выравнивание")
    left_indent = models.FloatField(verbose_name="Отступ слева")
    right_indent = models.FloatField(verbose_name="Отступ справа")
    first_line_indent = models.FloatField(verbose_name="Отступ первой строки абзаца")

    def __str__(self):
        return (
            f"Выравнивание: {dict(self.TYPES)[self.aligment]}, "
            f"Межстрочный интервал: {self.line_spacing}, "
            f"Отступ: {self.space_before}"
        )

    class Meta:
        verbose_name = "Абзац"
        verbose_name_plural = "Абзацы"


class Fields(models.Model):
    name = models.TextField(verbose_name="Название")
    top = models.FloatField(verbose_name="Верхнее")
    bottom = models.FloatField(verbose_name="Нижнее")
    left = models.FloatField(verbose_name="Левое")
    right = models.FloatField(verbose_name="Правое")

    class Meta:
        verbose_name = "Поле"
        verbose_name_plural = "Поля"

    def __str__(self):
        return self.name


class DocFormat(models.Model):
    font = models.ForeignKey(Font, on_delete=models.CASCADE, verbose_name="Шрифт")
    paragraph = models.ForeignKey(
        Paragraph, on_delete=models.CASCADE, verbose_name="Абзац"
    )
    fields = models.ForeignKey(
        Fields, on_delete=models.CASCADE, verbose_name="Поля", null=True
    )

    class Meta:
        verbose_name = "Документ"
        verbose_name_plural = "Документы"

    def __str__(self):
        return f"{self.font}"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Преподаватель"
        verbose_name_plural = "Преподаватели"


class TaskType(models.Model):
    name = models.TextField(verbose_name="Тип задания")

    class Meta:
        verbose_name = "Тип задания"
        verbose_name_plural = "Тип задания"

    def __str__(self):
        return self.name


class Task(models.Model):
    task_type = models.ForeignKey(
        TaskType, on_delete=models.CASCADE, verbose_name="Тип задания"
    )
    teacher = models.ForeignKey(
        Teacher, on_delete=models.CASCADE, verbose_name="Преподаватель"
    )
    students = models.ManyToManyField(Student, verbose_name="Студенты")
    text = models.TextField(verbose_name="Текст")
    rule = models.ForeignKey(
        DocFormat, verbose_name="Правило", on_delete=models.CASCADE
    )
    deadline = models.DateTimeField(verbose_name="Срок сдачи")
    example = models.FileField(
        verbose_name="Примеры работ", upload_to="examples/", null=True
    )
    example_pdf = models.FileField(
        verbose_name="Примеры работ в pdf", upload_to="examples/", null=True
    )

    class Meta:
        verbose_name = "Задание"
        verbose_name_plural = "Задания"

    def __str__(self):
        return self.text


class Result(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, verbose_name="Задание")
    result_docx = models.FileField(
        verbose_name="Результат в виде docx", upload_to="results/"
    )
    result_pdf = models.FileField(
        verbose_name="Результат в виде pdf", upload_to="results/"
    )
    student = models.ForeignKey(
        Student, verbose_name="Студент", on_delete=models.CASCADE, null=True
    )

    class Meta:
        verbose_name = "Результат"
        verbose_name_plural = "Результат"

    def __str__(self):
        return self.task.text
