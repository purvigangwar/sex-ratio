from django.contrib import admin
from .models import Female, Male
from import_export.admin import ImportExportActionModelAdmin
# from import_export import resources

# class FemaleResource(resources.ModelResource):
#     class Meta:
#         model = Female
#         import_id_fields = ['index']  # Specify the fields to be used as identifiers during import

# class MaleResource(resources.ModelResource):
#     class Meta:
#         model = Male
#         import_id_fields = ['index']  # Specify the fields to be used as identifiers during import

# @admin.register(Female)
# class FemaleAdmin(ImportExportActionModelAdmin):
#     resource_class = FemaleResource
#     list_display = ('index', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title')
#     search_fields = ['first_name', 'last_name', 'email', 'phone', 'job_title']
#     list_filter = ['sex', 'date_of_birth']
#     exclude = ('id',)

# @admin.register(Male)
# class MaleAdmin(ImportExportActionModelAdmin):
#     resource_class = MaleResource
#     list_display = ('index', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title')
#     search_fields = ['first_name', 'last_name', 'email', 'phone', 'job_title']
#     list_filter = ['sex', 'date_of_birth']
#     exclude = ('id',)

@admin.register(Female)
class FemaleAdmin(ImportExportActionModelAdmin):
    list_display = ('index', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title')
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'job_title']
    list_filter = ['sex', 'date_of_birth']
    # exclude = ('id',)

@admin.register(Male)
class MaleAdmin(ImportExportActionModelAdmin):
    list_display = ('index', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title')
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'job_title']
    list_filter = ['sex', 'date_of_birth']
    # exclude = ('id',)