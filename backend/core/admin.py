from django.contrib import admin
from .models import Subject, Topic, Lesson

# টপিকগুলো সাবজেক্টের ভেতরে দেখানোর জন্য
class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1 # একটা খালি ফর্ম সবসময় রাখবে

# লেসনগুলো টপিকের ভেতরে দেখানোর জন্য
class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0 
    fields = ('title', 'slug', 'order', 'difficulty') # শুধু প্রয়োজনীয় ফিল্ড দেখাবে, বড় কন্টেন্ট বাদ দেবে
    readonly_fields = ('slug',) # স্লাগ অটো তৈরি হবে, হাতে লিখতে হবে না

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'icon')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)} # টাইটেল লিখলে স্লাগ নিজে বসবে
    inlines = [TopicInline] # এই লাইনটার জন্য সাবজেক্টের ভেতরে টপিক দেখবে

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'order')
    list_filter = ('subject',)
    inlines = [LessonInline] # টপিকের ভেতরে লেসন দেখবে

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'difficulty', 'order')
    list_filter = ('difficulty', 'topic__subject') # ডিফিকাল্টি এবং সাবজেক্ট অনুযায়ী ফিল্টার করবে
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    
    # বড় কন্টেন্ট বক্স এবং সাধারণ ফিল্ড আলাদা করে দেখানোর জন্য
    fieldsets = (
        (None, {
            'fields': ('topic', 'title', 'slug', 'order', 'difficulty')
        }),
        ('Content', {
            'fields': ('content', 'summary'),
            'classes': ('wide',), # হরাইজন্টালি বড় স্পেস নেবে
        }),
    )