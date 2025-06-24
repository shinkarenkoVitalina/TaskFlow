from django.contrib import admin
from . import models


admin.site.register(models.WorkSpace)
admin.site.register(models.Desk)
admin.site.register(models.List)
admin.site.register(models.Card)
admin.site.register(models.CheckList)
admin.site.register(models.CheckListCard)
