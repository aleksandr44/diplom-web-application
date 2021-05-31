import datetime

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import LiveServerTestCase, RequestFactory
from rest_framework.test import APIClient

from docx_recognizer.models import DocFormat, Font, Paragraph, Task, TaskType, Teacher


class SimpleTest(LiveServerTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username="user", email="user@…", password="top_secret"
        )

        data_font = {}
        data_font["name"] = "Times New Roman"
        data_font["type"] = "i"
        data_font["size"] = "10"
        font = Font.objects.create(**data_font)

        data_paragraph = {}

        data_paragraph["alignment"] = "CENTER"
        data_paragraph["line_spacing"] = "1.5"
        data_paragraph["left_indent"] = "1"
        data_paragraph["right_indent"] = "1"
        data_paragraph["first_line_indent"] = "1"

        paragraph = Paragraph.objects.create(**data_paragraph)

        self.task = Task.objects.create(
            rule=DocFormat.objects.create(font=font, paragraph=paragraph),
            task_type=TaskType.objects.create(name="11111"),
            text="1111",
            deadline=datetime.datetime.now(),
            teacher=Teacher.objects.create(user=self.user),
        )

    def test_get_initial_data(self):
        """Проверка данных инициализации"""
        client = APIClient()
        response = client.get("/get_initial_data/")

        self.assertEqual(response.status_code, 200)

    def test_login(self):
        """Тестирование входа"""
        client = APIClient()
        response = client.post(
            "/login/",
            {"login": self.user.username, "password": "top_secret"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)

    def test_invalid_login(self):
        """Тестирование невалидного логина"""
        client = APIClient()
        response = client.post(
            "/login/",
            {"login": self.user.username, "password": "111111"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_get_initial_data_for_create_task(self):
        """Тестирование невалидного логина"""
        client = APIClient()
        response = client.get("/get_initial_data_for_create_task/")

        self.assertEqual(response.status_code, 200)

    def test_create_style(self):
        """Тестирование создания стиля"""
        client = APIClient()

        data = {}
        data["fontName"] = "Times New Roman"
        data["fontType"] = "i"
        data["fontSize"] = "10"
        data["aligment"] = "CENTER"
        data["line_spacing"] = "1.5"
        data["left_indent"] = "1"
        data["right_indent"] = "1"
        data["first_line_indent"] = "1"

        response = client.post("/create_style/", {"styles": data}, format="json")

        self.assertEqual(response.status_code, 200)

    def test_file_recognizer(self):
        """Тестирование проверки стиля"""
        client = APIClient()

        f = open(
            r"D:\soft\docxReader\docreader\docx_recognizer\fixtures\план.docx", "rb"
        )

        response = client.post(
            "/recognize_file/",
            {"task_id": self.task.id, "params": SimpleUploadedFile("cover", f.read())},
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["result_docx"])
        self.assertTrue(response.json()["result_pdf"])
