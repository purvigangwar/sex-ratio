from rest_framework import serializers
from .models import Female, Male

class FemaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Female
        fields = ['index', 'user_id', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title']

class MaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Male
        fields = ['index', 'user_id', 'first_name', 'last_name', 'sex', 'email', 'phone', 'date_of_birth', 'job_title']
