from custom_auth.services import get_user_from_token
from django.http import HttpResponse
from django.shortcuts import redirect


from django.http import HttpResponse


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extract JWT token from the cookies
        jwt_token = request.COOKIES.get("access_token")
        if jwt_token:
            # Add the JWT token to the Authorization header
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {jwt_token}"
            request.user = get_user_from_token(request)
            if request.user is None:
                # Invalidate the cookies and return 401 Unauthorized if the token is invalid
                response = HttpResponse(status=401)
                response.delete_cookie("access_token")
                response.delete_cookie("refresh_token")
            else:
                # Proceed with the request normally if the token is valid
                response = self.get_response(request)
        else:
            # No token found, proceed with the original request
            # This can be changed to handle cases where token must exist
            response = self.get_response(request)

        return response
