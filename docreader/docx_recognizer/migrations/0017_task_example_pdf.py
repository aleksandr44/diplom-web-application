# Generated by Django 3.1.7 on 2021-05-15 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0016_remove_task_example_pdf"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="example_pdf",
            field=models.FileField(
                null=True, upload_to="examples/", verbose_name="Примеры работ в pdf"
            ),
        ),
    ]
