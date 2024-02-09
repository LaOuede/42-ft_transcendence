#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate


# Remove existing superusers
echo "Removing existing superusers..."
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(is_superuser=True).delete(); print('Superusers removed')"

# Create superuser automatically (if it doesn't exist)
echo "Creating superuser..."
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}
SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}

echo "Superuser email: $SUPERUSER_EMAIL"
echo "Superuser password: $SUPERUSER_PASSWORD"

# Check if the superuser already exists, create if not, and set the password
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user, created = User.objects.get_or_create(email='$SUPERUSER_EMAIL', defaults={'username': '$SUPERUSER_USERNAME'}); user.set_password('$SUPERUSER_PASSWORD'); user.save(); print('Superuser created: ', created)"

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
