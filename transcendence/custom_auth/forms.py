from django import forms
from user.models import User
from django.core.exceptions import ValidationError


class OTPVerificationForm(forms.Form):
    otp = forms.CharField(required=True, min_length=6, max_length=6)
    session_token = forms.CharField(required=True)


class RegistrationForm(forms.Form):
    username = forms.CharField(required=True, max_length=50, min_length=3)
    email = forms.EmailField(required=True, max_length=80)
    password = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        min_length=8,
        max_length=26,
        label="Password",
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        min_length=8,
        max_length=26,
        label="Confirm password",
    )

    def clean_username(self):
        username = self.cleaned_data["username"]
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username is already taken.")
        return username

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email is already in use.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("password") != cleaned_data.get("password2"):
            self.add_error("password2", "Passwords do not match.")


class LoginForm(forms.Form):
    username = forms.CharField(required=True, max_length=50, min_length=3)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    def clean_username(self):
        username = self.cleaned_data["username"]
        if not User.objects.filter(username=username).exists():
            raise ValidationError("Username does not exist.")
        return username

    def clean_password(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if not username:
            raise ValidationError("Username is required to check the password.")
        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                raise ValidationError("Invalid password.")
        except User.DoesNotExist:
            raise ValidationError("Invalid password.")

        return password
