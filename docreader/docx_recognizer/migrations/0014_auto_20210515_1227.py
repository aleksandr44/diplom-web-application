# Generated by Django 3.1.7 on 2021-05-15 09:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0013_task_example"),
    ]

    operations = [
        migrations.RenameField(
            model_name="task",
            old_name="task_type_id",
            new_name="task_type",
        ),
        migrations.RenameField(
            model_name="task",
            old_name="teacher_id",
            new_name="teacher",
        ),
    ]
