from rest_framework.generics import ListAPIView
from .models import Female, Male
from .serializers import FemaleSerializer, MaleSerializer
from django.http import JsonResponse
from .models import Male, Female
from django.db.models import Count
from django.db.models.functions import ExtractMonth

class FemaleList(ListAPIView):
    queryset = Female.objects.all()
    serializer_class = FemaleSerializer

class MaleList(ListAPIView):
    queryset = Male.objects.all()
    serializer_class = MaleSerializer

month_names = [
    None,  # Index 0 is not used, so set it to None
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

def get_monthly_data(request):
    # Query male data
    male_data = Male.objects.annotate(month=ExtractMonth('date_of_birth')).values('month').annotate(count=Count('id'))
    
    # Query female data
    female_data = Female.objects.annotate(month=ExtractMonth('date_of_birth')).values('month').annotate(count=Count('id'))
    
    # Combine male and female data for each month
    data = []
    for month in range(1, 13):  # Loop through each month
        male_count = next((item['count'] for item in male_data if item['month'] == month), 0)
        female_count = next((item['count'] for item in female_data if item['month'] == month), 0)
        data.append({
            'month': month_names[month],  # Assuming you have a list of month names
            'male': male_count,
            'female': female_count
        })
    
    return JsonResponse(data, safe=False)

