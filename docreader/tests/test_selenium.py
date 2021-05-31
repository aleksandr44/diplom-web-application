# Подключить встроенный сервер Django для использования клиента Selenium
# Подключить вебдрайвер управления браузером (тут Chrome)
from selenium import webdriver
import time

from django.contrib.auth.models import User
from docx_recognizer.models import Teacher, Student
from django.test import LiveServerTestCase, RequestFactory
from webdriver_manager.chrome import ChromeDriverManager



class SeleniumTests(LiveServerTestCase):

    @classmethod
    def setUpClass(cls):
        # Поднимаем живой сервер на тех же адресах, что и обычный
        cls.host = "127.0.0.1"
        cls.port = 8000
        super(SeleniumTests, cls).setUpClass()

    def setUp(self):
        # Подготовка данных к тестированию.
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username="user", email="user@…", password="user"
        )

        self.user_student = User.objects.create_user(
            username="student", email="user@…", password="student"
        )
        self.teacher = Teacher.objects.create(user=self.user)
        self.student = Student.objects.create(user=self.user_student)
        # Подключить webdriver Chrome
        self.br = webdriver.Chrome(ChromeDriverManager().install())

    def test_auth_invalid(self):
        """Тестирование невалидного входа"""
        # Перейти на главную страницу, получив адрес сервера 'localhost:8081' и полный URL
        self.br.get('%s%s' % ('http://localhost:3000/', ''))

        input_button = self.br.find_element_by_css_selector(
                "#root > div > div:nth-child(1) > header > div > button > span.MuiButton-label"
            )

        # Тестируем авторизацию
        if input_button.text == "ВХОД":
            input_button.click()
            input_login = self.br.find_element_by_css_selector("#login")
            input_password = self.br.find_element_by_css_selector("#password")
            input_login.send_keys("user_invalid")
            input_password.send_keys("user_invalid")

            send = self.br.find_element_by_css_selector(
                "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div.MuiDialogActions-root.MuiDialogActions-spacing > button:nth-child(2)"
            )

            # Нажимаем на кнопку "Отправить"
            send.click()
            time.sleep(3)

            menu_items = self.br.find_elements_by_xpath(
                '//*[@id="root"]/div/div[1]/header/div/a'
            )

            assert len(menu_items) == 2, (
                f"Количество элементов меню не соответствует требованиям неавторизованного ползователя."
                f" Найдено {len(menu_items)}, нужно {2}"
            )

            assert (
                    self.br.find_elements_by_xpath('//*[@id="root"]/div/div/div[2]/div[2]')[0].text ==
                    'Неправивильный логин или пароль! Попробуйте снова.'
            ), 'Непрвильное сообщение о некорректном входе'

        # Отключить вебдрайвер, закрыть браузер
        self.br.quit()

    def test_auth_correct(self):
        """Тестирование невалидного входа"""
        # Перейти на главную страницу, получив адрес сервера 'localhost:8081' и полный URL
        self.br.get('%s%s' % ('http://localhost:3000/', ''))

        input_button = self.br.find_element_by_css_selector(
                "#root > div > div:nth-child(1) > header > div > button > span.MuiButton-label"
            )

        # Тестируем авторизацию
        if input_button.text == "ВХОД":
            input_button.click()
            input_login = self.br.find_element_by_css_selector("#login")
            input_password = self.br.find_element_by_css_selector("#password")
            input_login.send_keys("student")
            input_password.send_keys("student")

            send = self.br.find_element_by_css_selector(
                "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div.MuiDialogActions-root.MuiDialogActions-spacing > button:nth-child(2)"
            )

            # Нажимаем на кнопку "Отправить"
            send.click()
            time.sleep(3)

            menu_items = self.br.find_elements_by_xpath(
                '//*[@id="root"]/div/div[1]/header/div/a'
            )

            # Для авторизованного пользователя должно быть 4 элемента меню
            assert len(menu_items) == 2, (
                f"Количество элементов меню не соответствует требованиям авторизованного ползователя-Студента."
                f" Найдено {len(menu_items)}, нужно {4}"
            )

        # Отключить вебдрайвер, закрыть браузер
        self.br.quit()

    def test_auth_correct_student(self):
        """Тестирование невалидного входа Преподавателя"""
        # Перейти на главную страницу, получив адрес сервера 'localhost:8081' и полный URL
        self.br.get('%s%s' % ('http://localhost:3000/', ''))

        input_button = self.br.find_element_by_css_selector(
            "#root > div > div:nth-child(1) > header > div > button > span.MuiButton-label"
        )

        # Тестируем авторизацию
        if input_button.text == "ВХОД":
            input_button.click()
            input_login = self.br.find_element_by_css_selector("#login")
            input_password = self.br.find_element_by_css_selector("#password")
            input_login.send_keys("user")
            input_password.send_keys("user")

            send = self.br.find_element_by_css_selector(
                "body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollPaper > div > div.MuiDialogActions-root.MuiDialogActions-spacing > button:nth-child(2)"
            )

            # Нажимаем на кнопку "Отправить"
            send.click()
            time.sleep(3)

            menu_items = self.br.find_elements_by_xpath(
                '//*[@id="root"]/div/div[1]/header/div/a'
            )

            # Для авторизованного пользователя должно быть 4 элемента меню
            assert len(menu_items) == 4, (
                f"Количество элементов меню не соответствует требованиям авторизованного ползователя-Преподавателя."
                f" Найдено {len(menu_items)}, нужно {4}"
            )

        # Отключить вебдрайвер, закрыть браузер
        self.br.quit()
