В приложении отдельно крутятся бэк и фронт, поэтому их нужно запускать в отдельных терминалах

Предварительно нужно посавить postgres и создать БД docx_read 
либо поменять настройки на SQLite3 в настройках приложения.

Конфиги для подключения к БД лежат в env.test


Поднять бэкенд в отдельном терминале
1. `cd docreader` - переход в нужную папку
2. `pip install -r requirements.txt` - уставнока зависимостей
3. `python manage.py migrate` - миграции
4. `python manage.py createsuperuser` - создание суперпользователя
5. `python manage.py runserver` - запуск сервака

После того, как запуститлись - переходите в админку и запоняйте нужные поля записей.

Поднять фронт в отдельном терминале
Уствновить node js https://nodejs.org/en/
1. `cd front` - перейти в папку 
2. `npm install` - уставновить зависимости
3. `npm start` - запуск приложения

Он автоматом откроет страницу приложения, куда загружать файл