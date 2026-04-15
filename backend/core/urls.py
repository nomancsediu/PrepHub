from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin/subjects', views.SubjectAdminViewSet, basename='admin-subjects')
router.register(r'admin/topics', views.TopicAdminViewSet, basename='admin-topics')
router.register(r'admin/lessons', views.LessonAdminViewSet, basename='admin-lessons')

urlpatterns = [
    path('subjects/', views.SubjectListView.as_view(), name='subject-list'),
    path('subjects/<slug:slug>/', views.SubjectDetailView.as_view(), name='subject-detail'),
    path('lessons/search/', views.LessonSearchView.as_view(), name='lesson-search'),
    path('lessons/<slug:slug>/', views.LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<slug:slug>/adjacent/', views.get_adjacent_lessons, name='lesson-adjacent'),
    path('admin/login/', views.admin_login, name='admin-login'),
    path('ai/chat/', views.ai_chat, name='ai-chat'),
    path('', include(router.urls)),
]
