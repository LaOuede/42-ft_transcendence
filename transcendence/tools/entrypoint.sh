#!/bin/bash

# Wait for PostgreSQL container to be ready
until timeout 30 bash -c "echo > /dev/tcp/postgres/5432" 2>/dev/null
do
  echo "Waiting for PostgreSQL container to be ready..."
  # Sleep for 5 seconds before retrying
  sleep 5
done

echo "PostgreSQL container is ready. Continuing with startup tasks..."

echo "Applying database migrations..."
python transcendence/manage.py migrate

echo "Removing existing superusers..."
python transcendence/manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(is_superuser=True).delete(); print('Superusers removed')"

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
python transcendence/manage.py createsuperuser --noinput --username $SUPERUSER_USERNAME --email $SUPERUSER_EMAIL

# Set the superuser password
python transcendence/manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.get(username='$SUPERUSER_USERNAME'); user.set_password('$SUPERUSER_PASSWORD'); user.save();"

echo "Superuser created with username: $SUPERUSER_USERNAME, email: $SUPERUSER_EMAIL"

echo "Starting Django server..."
python transcendence/manage.py runserver 0.0.0.0:8000
