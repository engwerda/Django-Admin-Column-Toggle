from django.contrib import admin
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe


class ColumnToggleModelAdmin(admin.ModelAdmin):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.column_toggle_html = mark_safe(
            render_to_string("column_toggle/column_toggle.html")
        )

    class Media:
        css = {"all": ("column_toggle/column_toggle.css",)}
        js = ("column_toggle/column_toggle.js",)

    def change_list_template_extends(self, request):
        template = super().change_list_template_extends(request)
        return template.replace(
            "{% block extrahead %}",
            "{% block extrahead %}" + self.column_toggle_html,
        )
