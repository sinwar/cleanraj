from django.contrib import admin
from .models import UserProfile, addThing, location

admin.site.register(UserProfile)
admin.site.register(addThing)
admin.site.register(location)
