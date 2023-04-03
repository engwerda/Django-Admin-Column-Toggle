# Django Admin Column Toggle

Django Admin Column Toggle is a reusable Django package that adds column toggle functionality to the Django admin interface. This allows users to show or hide columns in the list view of the Django admin site.

## Installation

1. Install the package:

   With poetry
   ```
   poetry add django-admin-column-toggle
   ```
   With pip
   ```
   pip install django-admin-column-toggle
   ```

2. Add 'column_toggle' to your \`INSTALLED_APPS\` setting in your Django project:

   ```python
   INSTALLED_APPS = [
   ...
   'column_toggle',
   ]
   ```

## Usage

1. Import \`ColumnToggleModelAdmin\` from \`column_toggle.admin\` and inherit it in your \`ModelAdmin\` class. For example:

   ```python
   from django.contrib import admin
   from column_toggle.admin import ColumnToggleModelAdmin
   from .models import YourModel

   @admin.register(YourModel)
   class YourModelAdmin(ColumnToggleModelAdmin):
       list_display = ('field1', 'field2', 'field3')
   ```

2. To set the default selected columns, add the \`default_selected_columns\` attribute in your \`ModelAdmin\` class:

   ```python
   @admin.register(YourModel)
   class YourModelAdmin(ColumnToggleModelAdmin):
       list_display = ('field1', 'field2', 'field3')
       default_selected_columns = ['field1', 'field2']
   ```

   By doing this, only the specified columns ('field1' and 'field2' in this example) will be visible by default. Users can still toggle the visibility of other columns manually.


3. That's it! Now you should have column toggle functionality in the Django admin list view for the specified model.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
