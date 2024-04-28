from channels.auth import AuthMiddlewareStack
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from custom_auth.services import decode_jwt
from user.models import User

from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):

        user = await self.get_user_from_scope(scope)
        print("\033[36m", "[DEBUG] Executing custom channel middleware, User: ", user)
        scope["user"] = user
        return await self.app(scope, receive, send)

    async def get_cookies_from_scope(self, scope):
        headers = dict(scope.get('headers'))

        if b'cookie' in headers:
            cookie_bytes = headers.get(b'cookie')
            cookie_string = cookie_bytes.decode('utf-8')
            cookie_pairs = cookie_string.split(';')
            cookies = cookie_pairs
            cookies = {
                key.strip(): value.strip()
                for pair in cookie_pairs
                for key, value in (pair.split('='),)
            }
            return cookies


    async def get_user_from_scope(self, scope):

        cookies = await self.get_cookies_from_scope(scope)

        access_token = cookies.get("access_token")
        decoded_payload = await sync_to_async(decode_jwt)(access_token)
        if decoded_payload is not None:
            user = await get_user(decoded_payload.get("user_id"))
            if user:
                return user
        return AnonymousUser()

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
