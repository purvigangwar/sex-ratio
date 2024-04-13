import pandas as pd
from datetime import datetime
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangobackend.settings')
from models import Female, Male

def create_model_instances_from_csv(csv_file_path):
    df = pd.read_csv(csv_file_path)
    for _, row in df.iterrows():
        if row['Sex'].lower() == 'female':
            female_instance = Female(
                index=row['Index'],
                user_id=row['User Id'],
                first_name=row['First Name'],
                last_name=row['Last Name'],
                sex=row['Sex'],
                email=row['Email'],
                phone=row['Phone'],
                date_of_birth=datetime.strptime(row['Date of birth'], '%Y-%m-%d').date(),
                job_title=row['Job Title']
            )
            female_instance.save()
        elif row['Sex'].lower() == 'male':
            male_instance = Male(
                index=row['Index'],
                user_id=row['User Id'],
                first_name=row['First Name'],
                last_name=row['Last Name'],
                sex=row['Sex'],
                email=row['Email'],
                phone=row['Phone'],
                date_of_birth=datetime.strptime(row['Date of birth'], '%Y-%m-%d').date(),
                job_title=row['Job Title']
            )
            male_instance.save()

# Provide the path to your CSV file
csv_file_path = r'people-1000.csv'

# Create model instances from CSV data
create_model_instances_from_csv(csv_file_path)