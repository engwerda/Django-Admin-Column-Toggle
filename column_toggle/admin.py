from django.contrib import admin
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe


class ColumnToggleModelAdmin(admin.ModelAdmin):
    default_selected_columns = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.change_list_template = "column_toggle/change_list.html"

    def get_column_toggle_html(self, request):
        context = {
            "default_selected_columns": self.default_selected_columns,
            "list_display": self.list_display,
        }
        return mark_safe(
            render_to_string(
                "column_toggle/column_toggle.html", context, request=request
            )
        )

    class Media:
        css = {"all": ("column_toggle/column_toggle.css",)}
        js = ("column_toggle/column_toggle.js",)

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["column_toggle_html"] = self.get_column_toggle_html(request)
        return super().changelist_view(request, extra_context=extra_context)
