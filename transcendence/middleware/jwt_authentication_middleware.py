from custom_auth.services import get_user_from_token

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extract JWT token from the cookies
        jwt_token = request.COOKIES.get('access_token')
        if jwt_token:
            # Add the JWT token to the Authorization header
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {jwt_token}'
            request.user = get_user_from_token(request)

        response = self.get_response(request)
        return response
