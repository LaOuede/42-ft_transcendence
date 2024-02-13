#!/bin/bash

echo "Applying database migrations..."
python manage.py migrate

echo "Removing existing superusers..."
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(is_superuser=True).delete(); print('Superusers removed')"

echo "Creating superuser..."
# Ensure the environment variables are set before running this script
SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}
SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}

if [[ -z "$SUPERUSER_EMAIL" || -z "$SUPERUSER_PASSWORD" || -z "$SUPERUSER_USERNAME" ]]; then
  echo "Superuser environment variables not set. Please set DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD, and DJANGO_SUPERUSER_USERNAME."
  exit 1
fi

# Use Django management command to create superuser with environment variables
python manage.py createsuperuser --noinput --username $SUPERUSER_USERNAME --email $SUPERUSER_EMAIL

# Set the superuser password
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.get(username='$SUPERUSER_USERNAME'); user.set_password('$SUPERUSER_PASSWORD'); user.save();"

echo "Superuser created with username: $SUPERUSER_USERNAME, email: $SUPERUSER_EMAIL"

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000




