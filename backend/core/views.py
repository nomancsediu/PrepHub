from django.db.models import Count, Q
from django.conf import settings
from rest_framework import generics, viewsets, filters, status
from rest_framework.permissions import IsAdminUser, AllowAny, BasePermission
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import requests

from .models import Subject, Topic, Lesson, AdminUser
from .serializers import (
    SubjectListSerializer, SubjectDetailSerializer,
    LessonListSerializer, LessonDetailSerializer,
    SubjectAdminSerializer, TopicAdminSerializer, LessonAdminSerializer
)


class IsAdminPanelUser(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('X-Admin-Token')
        if not token:
            return False
        return AdminUser.objects.filter(token=token).exists()


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = AdminUser.objects.get(username=username)
        if user.check_password(password):
            token = user.generate_token()
            return Response({'token': token})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except AdminUser.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chat(request):
    message = request.data.get('message', '').strip()
    context = request.data.get('context', '').strip()
    history = request.data.get('history', [])

    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    api_key = settings.GROQ_API_KEY
    if not api_key:
        return Response({'error': 'AI service not configured'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    system_prompt = """You are a helpful AI assistant for PrepHub, a learning platform. 
Help students understand concepts clearly and concisely.
If lesson context is provided, use it to give more relevant answers.
Keep responses focused, clear and educational."""

    if context:
        system_prompt += f"\n\nCurrent lesson context:\n{context[:2000]}"

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:  # last 6 messages only
        messages.append({"role": h['role'], "content": h['content']})
    messages.append({"role": "user", "content": message})

    try:
        res = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={'model': 'llama-3.3-70b-versatile', 'messages': messages, 'max_tokens': 1024},
            timeout=30
        )
        res.raise_for_status()
        reply = res.json()['choices'][0]['message']['content']
        return Response({'reply': reply})
    except requests.exceptions.Timeout:
        return Response({'error': 'AI service timed out'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except Exception:
        return Response({'error': 'AI service error'}, status=status.HTTP_502_BAD_GATEWAY)


# ==========================================
# 1. Public APIs
# ==========================================

class SubjectListView(generics.ListAPIView):
    serializer_class = SubjectListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Subject.objects.prefetch_related('topics__lessons').annotate(
            lesson_count=Count('topics__lessons')
        )


class SubjectDetailView(generics.RetrieveAPIView):
    serializer_class = SubjectDetailSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Subject.objects.prefetch_related('topics__lessons').annotate(
            lesson_count=Count('topics__lessons')
        )


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.select_related('topic__subject').all()
    serializer_class = LessonDetailSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def get_adjacent_lessons(request, slug):
    try:
        current = Lesson.objects.get(slug=slug)
    except Lesson.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    siblings = list(
        Lesson.objects.filter(topic=current.topic).order_by('order').values('slug', 'title')
    )

    prev_lesson = None
    next_lesson = None

    for i, s in enumerate(siblings):
        if s['slug'] == slug:
            if i > 0:
                prev_lesson = siblings[i - 1]
            if i < len(siblings) - 1:
                next_lesson = siblings[i + 1]
            break

    return Response({"previous": prev_lesson, "next": next_lesson})


class LessonSearchView(generics.ListAPIView):
    serializer_class = LessonListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        q = self.request.query_params.get('q', '').strip()
        qs = Lesson.objects.select_related('topic__subject')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(summary__icontains=q))
        return qs


# ==========================================
# 2. Admin APIs
# ==========================================

class SubjectAdminViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectAdminSerializer
    permission_classes = [IsAdminPanelUser]
    pagination_class = None


class TopicAdminViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicAdminSerializer
    permission_classes = [IsAdminPanelUser]
    pagination_class = None


class LessonAdminViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonAdminSerializer
    permission_classes = [IsAdminPanelUser]
    pagination_class = None
