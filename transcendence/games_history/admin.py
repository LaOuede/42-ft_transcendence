from django.contrib import admin
from .models import Game, GamePlayer

admin.site.register([Game, GamePlayer])