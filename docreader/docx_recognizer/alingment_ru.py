# encoding: utf-8

"""
Enumerations related to text in WordprocessingML files
"""

from __future__ import absolute_import, print_function, unicode_literals

from .base import EnumMember, XmlEnumeration, XmlMappedEnumMember, alias


@alias("WD_ALIGN_PARAGRAPH")
class WD_PARAGRAPH_ALIGNMENT(XmlEnumeration):
    """
    alias: **WD_ALIGN_PARAGRAPH**

    Specifies paragraph justification type.

    Example::

        from docx.enum.text import WD_ALIGN_PARAGRAPH

        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    """

    __ms_name__ = "WdParagraphAlignment"

    __url__ = "http://msdn.microsoft.com/en-us/library/office/ff835817.aspx"

    __members__ = (
        XmlMappedEnumMember("LEFT", 0, "Слева", "Left-aligned"),
        XmlMappedEnumMember("CENTER", 1, "Центр", "Center-aligned."),
        XmlMappedEnumMember("RIGHT", 2, "Справа", "Right-aligned."),
        XmlMappedEnumMember("JUSTIFY", 3, "По ширине", "Fully justified."),
        XmlMappedEnumMember(
            "DISTRIBUTE",
            4,
            "distribute",
            "Paragraph characters are distrib"
            "uted to fill the entire width of the paragraph.",
        ),
        XmlMappedEnumMember(
            "JUSTIFY_MED",
            5,
            "mediumKashida",
            "Justified with a medium char" "acter compression ratio.",
        ),
        XmlMappedEnumMember(
            "JUSTIFY_HI",
            7,
            "highKashida",
            "Justified with a high character" " compression ratio.",
        ),
        XmlMappedEnumMember(
            "JUSTIFY_LOW",
            8,
            "lowKashida",
            "Justified with a low character " "compression ratio.",
        ),
        XmlMappedEnumMember(
            "THAI_JUSTIFY",
            9,
            "thaiDistribute",
            "Justified according to Tha" "i formatting layout.",
        ),
    )
