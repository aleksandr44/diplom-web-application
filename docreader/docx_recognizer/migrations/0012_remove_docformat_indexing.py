# Generated by Django 3.1.7 on 2021-05-14 19:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0011_auto_20210514_2200"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="docformat",
            name="indexing",
        ),
    ]
