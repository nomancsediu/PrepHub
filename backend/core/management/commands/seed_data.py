from django.core.management.base import BaseCommand
from core.models import Subject, Topic, Lesson


DATA = [
    {
        "title": "Python",
        "description": "Python programming fundamentals and advanced concepts.",
        "icon": "fa-python",
        "topics": [
            {
                "title": "Basics",
                "order": 1,
                "lessons": [
                    {
                        "title": "Variables and Data Types",
                        "order": 1,
                        "difficulty": "Easy",
                        "summary": "Python-এ variables declare করার নিয়ম এবং built-in data types।",
                        "content": "## Variables and Data Types\n\nPython dynamically typed language।\n\n```python\nname = 'Alice'\nage = 25\npi = 3.14\nis_active = True\n```\n\n### Common Types\n- `int`, `float`, `str`, `bool`, `list`, `dict`, `tuple`, `set`",
                    },
                    {
                        "title": "Lists and Loops",
                        "order": 2,
                        "difficulty": "Easy",
                        "summary": "List তৈরি, iterate করা এবং list comprehension।",
                        "content": "## Lists and Loops\n\n```python\nfruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n```",
                    },
                ],
            },
            {
                "title": "OOP",
                "order": 2,
                "lessons": [
                    {
                        "title": "Classes and Objects",
                        "order": 1,
                        "difficulty": "Medium",
                        "summary": "Class define করা, constructor এবং methods।",
                        "content": "## Classes and Objects\n\n```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} makes a sound'\n\ndog = Animal('Dog')\nprint(dog.speak())\n```",
                    },
                    {
                        "title": "Inheritance",
                        "order": 2,
                        "difficulty": "Medium",
                        "summary": "Parent class থেকে child class inherit করা।",
                        "content": "## Inheritance\n\n```python\nclass Dog(Animal):\n    def speak(self):\n        return f'{self.name} says Woof!'\n\ndog = Dog('Rex')\nprint(dog.speak())  # Rex says Woof!\n```",
                    },
                ],
            },
        ],
    },
    {
        "title": "Django",
        "description": "Django web framework - models, views, URLs, REST API।",
        "icon": "fa-server",
        "topics": [
            {
                "title": "Models",
                "order": 1,
                "lessons": [
                    {
                        "title": "Model Fields",
                        "order": 1,
                        "difficulty": "Easy",
                        "summary": "Django model-এ বিভিন্ন field type ব্যবহার।",
                        "content": "## Model Fields\n\n```python\nfrom django.db import models\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    body = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n    is_published = models.BooleanField(default=False)\n```",
                    },
                    {
                        "title": "QuerySet API",
                        "order": 2,
                        "difficulty": "Medium",
                        "summary": "filter, exclude, annotate, aggregate দিয়ে DB query।",
                        "content": "## QuerySet API\n\n```python\n# সব published post\nPost.objects.filter(is_published=True)\n\n# title দিয়ে search\nPost.objects.filter(title__icontains='django')\n\n# count\nPost.objects.count()\n```",
                    },
                ],
            },
            {
                "title": "REST API",
                "order": 2,
                "lessons": [
                    {
                        "title": "Serializers",
                        "order": 1,
                        "difficulty": "Medium",
                        "summary": "DRF serializer দিয়ে model data JSON-এ convert করা।",
                        "content": "## Serializers\n\n```python\nfrom rest_framework import serializers\nfrom .models import Post\n\nclass PostSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Post\n        fields = '__all__'\n```",
                    },
                    {
                        "title": "ViewSets",
                        "order": 2,
                        "difficulty": "Hard",
                        "summary": "ModelViewSet দিয়ে CRUD endpoints তৈরি।",
                        "content": "## ViewSets\n\n```python\nfrom rest_framework.viewsets import ModelViewSet\nfrom .models import Post\nfrom .serializers import PostSerializer\n\nclass PostViewSet(ModelViewSet):\n    queryset = Post.objects.all()\n    serializer_class = PostSerializer\n```",
                    },
                ],
            },
        ],
    },
    {
        "title": "JavaScript",
        "description": "Modern JavaScript - ES6+, async/await, DOM manipulation।",
        "icon": "fa-js",
        "topics": [
            {
                "title": "ES6+ Features",
                "order": 1,
                "lessons": [
                    {
                        "title": "Arrow Functions",
                        "order": 1,
                        "difficulty": "Easy",
                        "summary": "Arrow function syntax এবং this binding।",
                        "content": "## Arrow Functions\n\n```js\n// Traditional\nfunction add(a, b) { return a + b; }\n\n// Arrow\nconst add = (a, b) => a + b;\n\n// With body\nconst greet = name => {\n  return `Hello, ${name}!`;\n};\n```",
                    },
                    {
                        "title": "Promises and Async/Await",
                        "order": 2,
                        "difficulty": "Medium",
                        "summary": "Asynchronous code handle করার modern পদ্ধতি।",
                        "content": "## Async/Await\n\n```js\nasync function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}\n```",
                    },
                ],
            },
        ],
    },
    {
        "title": "Data Structures",
        "description": "Array, LinkedList, Stack, Queue, Tree, Graph - interview prep।",
        "icon": "fa-sitemap",
        "topics": [
            {
                "title": "Linear Structures",
                "order": 1,
                "lessons": [
                    {
                        "title": "Stack",
                        "order": 1,
                        "difficulty": "Easy",
                        "summary": "LIFO principle, push/pop operations।",
                        "content": "## Stack\n\nLast In First Out (LIFO)।\n\n```python\nstack = []\nstack.append(1)  # push\nstack.append(2)\nstack.pop()      # returns 2\n```\n\n### Use Cases\n- Function call stack\n- Undo/Redo\n- Balanced parentheses check",
                    },
                    {
                        "title": "Queue",
                        "order": 2,
                        "difficulty": "Easy",
                        "summary": "FIFO principle, enqueue/dequeue operations।",
                        "content": "## Queue\n\nFirst In First Out (FIFO)।\n\n```python\nfrom collections import deque\n\nq = deque()\nq.append(1)    # enqueue\nq.append(2)\nq.popleft()    # dequeue → returns 1\n```",
                    },
                ],
            },
            {
                "title": "Trees",
                "order": 2,
                "lessons": [
                    {
                        "title": "Binary Search Tree",
                        "order": 1,
                        "difficulty": "Hard",
                        "summary": "BST insert, search এবং traversal।",
                        "content": "## Binary Search Tree\n\n```python\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef insert(root, val):\n    if not root:\n        return Node(val)\n    if val < root.val:\n        root.left = insert(root.left, val)\n    else:\n        root.right = insert(root.right, val)\n    return root\n```",
                    },
                ],
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed dummy data into the database"

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Clear existing data before seeding")

    def handle(self, *args, **options):
        if options["clear"]:
            Lesson.objects.all().delete()
            Topic.objects.all().delete()
            Subject.objects.all().delete()
            self.stdout.write(self.style.WARNING("Existing data cleared."))

        lesson_count = 0
        for subj_data in DATA:
            subject, _ = Subject.objects.get_or_create(
                title=subj_data["title"],
                defaults={
                    "description": subj_data["description"],
                    "icon": subj_data["icon"],
                },
            )
            for topic_data in subj_data["topics"]:
                topic, _ = Topic.objects.get_or_create(
                    subject=subject,
                    title=topic_data["title"],
                    defaults={"order": topic_data["order"]},
                )
                for lesson_data in topic_data["lessons"]:
                    _, created = Lesson.objects.get_or_create(
                        topic=topic,
                        title=lesson_data["title"],
                        defaults={
                            "order": lesson_data["order"],
                            "difficulty": lesson_data["difficulty"],
                            "summary": lesson_data["summary"],
                            "content": lesson_data["content"],
                        },
                    )
                    if created:
                        lesson_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done! {len(DATA)} subjects, topics & {lesson_count} new lessons seeded."
        ))
