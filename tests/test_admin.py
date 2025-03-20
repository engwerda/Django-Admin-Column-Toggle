from unittest.mock import MagicMock, patch

from django.contrib import admin
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import User
from django.db import models
from django.test import RequestFactory, SimpleTestCase

from column_toggle.admin import ColumnToggleModelAdmin


class ExampleModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = "tests"


class ExampleModelAdmin(ColumnToggleModelAdmin):
    list_display = ("name", "description", "created_at")
    default_selected_columns = ["name", "description"]


class MockRequest:
    def __init__(self, user):
        self.user = user


class ColumnToggleModelAdminTest(SimpleTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.site = AdminSite()
        cls.user = MagicMock(spec=User)
        cls.user.is_active = True
        cls.user.has_perm = MagicMock(return_value=True)
        cls.request = MockRequest(cls.user)
        cls.factory = RequestFactory()
        cls.model_admin = ExampleModelAdmin(ExampleModel, cls.site)

        if not admin.site.is_registered(ExampleModel):
            admin.site.register(ExampleModel, ExampleModelAdmin)

    @patch("column_toggle.admin.ColumnToggleModelAdmin.get_column_toggle_html")
    def test_get_column_toggle_html(self, mock_get_column_toggle_html):
        mock_get_column_toggle_html.return_value = (
            '<div class="column-toggle-container"></div>'
        )
        html = self.model_admin.get_column_toggle_html(self.request)
        self.assertIn("column-toggle-container", html)

    @patch("django.contrib.admin.views.main.ChangeList")
    def test_changelist_view(self, mock_changelist):
        mock_changelist_instance = MagicMock()
        mock_changelist.return_value = mock_changelist_instance
        mock_changelist_instance.get_results.return_value = None

        request = self.factory.get("/admin/tests/examplemodel/")
        request.user = self.user
        response = self.model_admin.changelist_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn("column_toggle_html", response.context_data)
