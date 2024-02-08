#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Create superuser automatically (if it doesn't exist)
echo "Creating superuser..."
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='$SUPERUSER_EMAIL').exists() or User.objects.create_superuser('admin', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')"

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
