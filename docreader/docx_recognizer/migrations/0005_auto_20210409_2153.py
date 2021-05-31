# Generated by Django 3.1.7 on 2021-04-09 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0004_auto_20210409_2152"),
    ]

    operations = [
        migrations.AlterField(
            model_name="paragraph",
            name="aligment",
            field=models.IntegerField(
                choices=[
                    (0, "По ширине"),
                    (1, "По центру"),
                    (2, "По правому краю"),
                    (3, "По левому краю"),
                ],
                verbose_name="Выравнивание",
            ),
        ),
    ]
