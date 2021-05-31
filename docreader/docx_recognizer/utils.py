from pathlib import Path

import comtypes.client
import pythoncom
from django.http.response import HttpResponse, JsonResponse
from docx import Document
from docx.shared import Pt

from .models import DocFormat, Font, Paragraph, Result
from .serializers import ResultSerializer

BASE_DIR = Path(__file__).resolve().parent.parent


def style_creator(data):
    """Функция для создания стилей.
    :param data: Словарь для оздания стиля оформления
    """
    font = Font.objects.create(
        name=data["fontName"], type=data["fontType"], size=data["fontSize"]
    )

    paragraph = Paragraph.objects.create(
        alignment=data["aligment"],
        line_spacing=data["line_spacing"],
        left_indent=data["left_indent"],
        right_indent=data["right_indent"],
        first_line_indent=data["first_line_indent"],
    )

    doc = DocFormat.objects.create(
        font=font,
        paragraph=paragraph,
        fields_id=data.get("fields")
    )

    return doc


def doc2pdf(doc_name, pdf_name):
    """ Конвертация в PDF.
    :param doc_name word file name
    :param pdf_name to_pdf file name
    """
    try:
        pythoncom.CoInitialize()
        try:
            word = comtypes.client.CreateObject("Word.Application")
            doc = word.Documents.Open(doc_name)
            doc.SaveAs(pdf_name, FileFormat=17)
            doc.Close()
            word.Quit()
        finally:
            pythoncom.CoUninitialize()

        return pdf_name
    except Exception as e:
        return 1


def check_format_docx(input_file, doc_format, task_id=None):
    """Проверка формата docx.

    :param input_file: Входящий файл
    :param doc_format: правило оформления
    :param task_id: id задачи
    """
    doc_font = doc_format.font
    aligment = doc_format.paragraph.WD_PARAGRAPH_ALIGNMENT.__dict__[doc_format.paragraph.alignment]
    line_spacing = doc_format.paragraph.line_spacing
    file_name = f"{BASE_DIR}/media/{input_file}"
    docfile = Document(file_name)

    for paragraph in docfile.paragraphs:
        if doc_format.paragraph.line_spacing != paragraph.paragraph_format.line_spacing:
            paragraph.add_comment(
                f"Не правильный межстрочный интервал: должен быть {doc_format.paragraph.line_spacing}, обнаружен {paragraph.paragraph_format.line_spacing}"
            )

        if doc_format.fields:
            if (
                int(docfile.sections[0].left_margin.cm) != int(doc_format.fields.left) or
                round(docfile.sections[0].right_margin.cm, 1) != round(doc_format.fields.right, 1) or
                int(docfile.sections[0].bottom_margin.cm) != int(doc_format.fields.bottom) or
                int(docfile.sections[0].top_margin.cm) != int(doc_format.fields.top)
            ):
                paragraph.add_comment("Не правильный размер полей")

        if "Heading" in paragraph.style.name or not paragraph.text:
            continue

        if not paragraph.text:
            continue

        for run in paragraph.runs:
            if not run.font.name == doc_font.name and run.font.name:
                paragraph.add_comment(
                    f"Не правильный шрифт: должен быть {doc_font.name}, обнаружен {run.font.name}"
                )

            if not Pt(int(doc_font.size)) == run.font.size and run.font.size:
                paragraph.add_comment(f"Не правильный размер шрифта. Требуется {Pt(doc_font.size)}. Найден {run.font.size}")

            if run.bold and not doc_font.type == 'st':
                paragraph.add_comment(f"Не правильный тип шрифта. Требуется стандартный. Найден жирный")
            elif run.bold and not doc_font.type == 'i':
                paragraph.add_comment(f"Не правильный тип шрифта. Требуется курсив. Найден жирный")

        if not paragraph.paragraph_format.alignment == aligment:
            paragraph.add_comment("Не правильное выравнивание")
        if not paragraph.paragraph_format.line_spacing == line_spacing:
            paragraph.add_comment("Не правильные отступы")

    response = HttpResponse(
        docfile,
        content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    docfile.save(file_name)

    pdf_file_name = f"{file_name.split('.')[0]}.pdf"
    pdf_file = doc2pdf(file_name, pdf_file_name)

    response["Content-Disposition"] = "attachment; filename=download.docx"

    if task_id:
        result = Result.objects.create(
            task_id=task_id, result_docx=file_name, result_pdf=pdf_file
        )
    else:
        result = Result(result_docx=file_name, result_pdf=pdf_file)

    data = ResultSerializer(result).data

    return JsonResponse(data, safe=False)
