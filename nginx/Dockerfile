# Use the official Nginx image as a parent image
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration
COPY conf/default.conf /etc/nginx/conf.d
