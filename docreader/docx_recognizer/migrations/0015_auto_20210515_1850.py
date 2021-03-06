# Generated by Django 3.1.7 on 2021-05-15 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("docx_recognizer", "0014_auto_20210515_1227"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="example_pdf",
            field=models.FileField(
                null=True, upload_to="examples/", verbose_name="Примеры работ"
            ),
        ),
        migrations.AlterField(
            model_name="task",
            name="example",
            field=models.FileField(
                null=True, upload_to="examples/", verbose_name="Примеры работ"
            ),
        ),
    ]
