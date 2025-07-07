from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'workspaces', views.WorkSpaceViewSet, basename='workspace')
router.register(r'desks', views.DeskViewSet, basename='desk')
router.register(r'lists', views.ListViewSet, basename='list')
router.register(r'cards', views.CardViewSet, basename='card')
router.register(r'checklists', views.CheckListViewSet, basename='checklist')
router.register(r'checklist_items', views.CheckListCardViewSet, basename='checklistitem')

urlpatterns = router.urls