# Generated by Django 3.1.7 on 2021-05-13 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0009_auto_20210510_2039"),
    ]

    operations = [
        migrations.CreateModel(
            name="Fields",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.TextField(verbose_name="Название")),
                ("top", models.TextField(verbose_name="Верхнее")),
                ("bottom", models.TextField(verbose_name="Нижнее")),
                ("left", models.TextField(verbose_name="Левое")),
                ("right", models.TextField(verbose_name="Левое")),
            ],
            options={
                "verbose_name": "Поле",
                "verbose_name_plural": "Поля",
            },
        ),
        migrations.AlterModelOptions(
            name="tasktype",
            options={
                "verbose_name": "Тип задания",
                "verbose_name_plural": "Тип задания",
            },
        ),
    ]