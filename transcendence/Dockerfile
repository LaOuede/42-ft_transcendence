# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /backend

# Install dependencies
COPY requirements.txt /backend/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . /backend/

COPY ./tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Pour garder le container en vie quand on veut trouver un bug
#ENTRYPOINT ["tail", "-f", "/dev/null"]