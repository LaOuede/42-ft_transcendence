"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter
from channels.auth import AuthMiddlewareStack
from middleware.ws_auth_middleware import TokenAuthMiddlewareStack

from friends.routing import ws_urlpatterns



application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'https': django_asgi_app,
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(ws_urlpatterns)
    ),
})
