from core.models import Subject, Topic, Lesson

data = [
    {
        "title": "Software Development with Django",
        "description": "Learn backend web development using Python and Django framework.",
        "icon": "fa-django",
        "topics": [
            {
                "title": "Python Basics",
                "lessons": [
                    ("Variables & Data Types", "Easy", "Learn int, str, list, dict and type casting."),
                    ("Loops & Iteration", "Easy", "for loops, while loops, range() and enumerate."),
                    ("Functions & Scope", "Medium", "def, return, *args, **kwargs, closures."),
                    ("OOP Fundamentals", "Medium", "Classes, objects, __init__, inheritance."),
                ]
            },
            {
                "title": "Django Setup",
                "lessons": [
                    ("Installing Django", "Easy", "pip, virtual environments, django-admin."),
                    ("Project Structure", "Easy", "manage.py, settings, urls, apps overview."),
                    ("Creating Your First App", "Easy", "startapp, INSTALLED_APPS, migrations."),
                ]
            },
            {
                "title": "Models & ORM",
                "lessons": [
                    ("Defining Models", "Medium", "CharField, IntegerField, ForeignKey, Meta."),
                    ("Migrations", "Medium", "makemigrations, migrate, squashmigrations."),
                    ("QuerySet API", "Hard", "filter, exclude, annotate, select_related."),
                    ("Django Admin", "Easy", "Register models, list_display, search_fields."),
                ]
            },
            {
                "title": "REST API with DRF",
                "lessons": [
                    ("Serializers", "Medium", "ModelSerializer, validation, nested serializers."),
                    ("ViewSets & Routers", "Hard", "ModelViewSet, DefaultRouter, custom actions."),
                    ("Permissions & Auth", "Hard", "IsAuthenticated, JWT, custom permissions."),
                    ("Pagination & Filtering", "Medium", "PageNumberPagination, django-filters."),
                ]
            },
        ]
    },
    {
        "title": "OOP and Python Programming",
        "description": "Master object-oriented programming concepts using Python.",
        "icon": "fa-python",
        "topics": [
            {
                "title": "Classes & Objects",
                "lessons": [
                    ("Introduction to OOP", "Easy", "What is OOP, why use it, real-world analogy."),
                    ("Class & Instance", "Easy", "Defining classes, creating objects, __init__."),
                    ("Instance vs Class Variables", "Medium", "self, class-level attributes, shared state."),
                ]
            },
            {
                "title": "Inheritance",
                "lessons": [
                    ("Single Inheritance", "Easy", "Parent and child classes, super()."),
                    ("Multiple Inheritance", "Medium", "MRO, diamond problem, method resolution."),
                    ("Abstract Classes", "Medium", "abc module, @abstractmethod, interfaces."),
                ]
            },
            {
                "title": "Polymorphism & Encapsulation",
                "lessons": [
                    ("Method Overriding", "Medium", "Overriding parent methods, super() usage."),
                    ("Encapsulation", "Medium", "Private, protected attributes, name mangling."),
                    ("Duck Typing", "Hard", "Python's dynamic typing and polymorphism."),
                    ("Magic Methods", "Hard", "__str__, __repr__, __len__, __eq__ and more."),
                ]
            },
        ]
    },
    {
        "title": "Database Management",
        "description": "Understand relational databases, SQL and database design.",
        "icon": "fa-database",
        "topics": [
            {
                "title": "SQL Fundamentals",
                "lessons": [
                    ("Introduction to SQL", "Easy", "What is SQL, RDBMS, tables, rows, columns."),
                    ("SELECT Queries", "Easy", "SELECT, WHERE, ORDER BY, LIMIT."),
                    ("Filtering & Aggregation", "Medium", "GROUP BY, HAVING, COUNT, SUM, AVG."),
                    ("JOINs", "Medium", "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN."),
                ]
            },
            {
                "title": "Database Design",
                "lessons": [
                    ("ER Diagrams", "Easy", "Entities, attributes, relationships, cardinality."),
                    ("Normalization", "Medium", "1NF, 2NF, 3NF, BCNF with examples."),
                    ("Indexes & Performance", "Hard", "B-tree index, query optimization, EXPLAIN."),
                ]
            },
            {
                "title": "PostgreSQL",
                "lessons": [
                    ("Setup & psql CLI", "Easy", "Install PostgreSQL, connect, basic commands."),
                    ("Advanced Queries", "Hard", "CTEs, window functions, subqueries."),
                    ("Transactions & ACID", "Hard", "BEGIN, COMMIT, ROLLBACK, isolation levels."),
                ]
            },
        ]
    },
    {
        "title": "Data Structures & Algorithms",
        "description": "Learn core DSA concepts for problem solving and interviews.",
        "icon": "fa-code",
        "topics": [
            {
                "title": "Arrays & Strings",
                "lessons": [
                    ("Array Basics", "Easy", "Indexing, slicing, traversal, time complexity."),
                    ("Two Pointer Technique", "Medium", "Pair sum, reverse, sliding window intro."),
                    ("String Manipulation", "Easy", "Reverse, palindrome, anagram, substring."),
                ]
            },
            {
                "title": "Linked Lists",
                "lessons": [
                    ("Singly Linked List", "Medium", "Node, head, insert, delete, traverse."),
                    ("Doubly Linked List", "Medium", "Prev pointer, bidirectional traversal."),
                    ("Fast & Slow Pointers", "Hard", "Cycle detection, middle node, Floyd's algo."),
                ]
            },
            {
                "title": "Sorting & Searching",
                "lessons": [
                    ("Bubble & Selection Sort", "Easy", "Basic O(n²) sorts with visualization."),
                    ("Merge Sort", "Medium", "Divide and conquer, O(n log n) complexity."),
                    ("Binary Search", "Medium", "Iterative & recursive, search space reduction."),
                    ("Quick Sort", "Hard", "Pivot selection, partitioning, worst case."),
                ]
            },
            {
                "title": "Trees & Graphs",
                "lessons": [
                    ("Binary Trees", "Medium", "Node structure, traversals: inorder, preorder."),
                    ("Binary Search Tree", "Medium", "Insert, delete, search, BST properties."),
                    ("Graph Representation", "Hard", "Adjacency list vs matrix, BFS, DFS."),
                    ("Shortest Path", "Hard", "Dijkstra's algorithm, BFS for unweighted."),
                ]
            },
        ]
    },
]

for s_data in data:
    subject = Subject.objects.create(
        title=s_data["title"],
        description=s_data["description"],
        icon=s_data["icon"],
    )
    for t_idx, t_data in enumerate(s_data["topics"]):
        topic = Topic.objects.create(
            subject=subject,
            title=t_data["title"],
            order=t_idx,
        )
        for l_idx, (title, difficulty, summary) in enumerate(t_data["lessons"]):
            Lesson.objects.create(
                topic=topic,
                title=title,
                difficulty=difficulty,
                summary=summary,
                order=l_idx,
            )

print(f"Created {Subject.objects.count()} subjects")
print(f"Created {Topic.objects.count()} topics")
print(f"Created {Lesson.objects.count()} lessons")
