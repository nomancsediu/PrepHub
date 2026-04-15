from rest_framework import serializers
from .models import Subject, Topic, Lesson


# ==========================================
# 1. Public Serializers
# ==========================================

class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'slug', 'order', 'difficulty', 'summary']


class TopicListSerializer(serializers.ModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    lessons = LessonSummarySerializer(many=True, read_only=True)

    def get_lesson_count(self, obj):
        return obj.lessons.count()

    class Meta:
        model = Topic
        fields = ['id', 'title', 'order', 'lesson_count', 'lessons']


class SubjectListSerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(read_only=True)  # comes from annotated queryset
    topics = TopicListSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'slug', 'description', 'icon', 'lesson_count', 'topics']


class SubjectDetailSerializer(serializers.ModelSerializer):
    topics = TopicListSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'title', 'slug', 'description', 'icon', 'topics']


class LessonListSerializer(serializers.ModelSerializer):
    subject_title = serializers.CharField(source='topic.subject.title', read_only=True)
    subject_slug = serializers.CharField(source='topic.subject.slug', read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'slug', 'difficulty', 'summary', 'subject_title', 'subject_slug']


class LessonDetailSerializer(serializers.ModelSerializer):
    topic_title = serializers.CharField(source='topic.title', read_only=True)
    subject_title = serializers.CharField(source='topic.subject.title', read_only=True)
    subject_slug = serializers.CharField(source='topic.subject.slug', read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'order', 'difficulty',
            'content', 'summary',
            'topic_title', 'subject_title', 'subject_slug'
        ]


# ==========================================
# 2. Admin Serializers
# ==========================================

class SubjectAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class TopicAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class LessonAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
