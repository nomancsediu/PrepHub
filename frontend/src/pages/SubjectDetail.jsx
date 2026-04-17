import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubject } from '../services/api';
import Sidebar from '../components/Sidebar';
import LessonList from '../components/LessonList';
import LessonContent from '../components/LessonContent';


const DUMMY = {
  title: 'Data Structures & Algorithms',
  slug: 'data-structures-algorithms',
  topics: [
    {
      id: 1, title: 'Arrays & Strings', order: 0,
      lessons: [
        { slug: 'array-basics', title: 'Array Basics', difficulty: 'Easy', summary: 'Learn the fundamentals of arrays including indexing, traversal, and basic operations.' },
        { slug: 'two-pointer-technique', title: 'Two Pointer Technique', difficulty: 'Medium', summary: 'Solve array problems efficiently using two pointers moving toward each other.' },
        { slug: 'string-manipulation', title: 'String Manipulation', difficulty: 'Medium', summary: 'Common string operations, immutability, and efficient concatenation patterns.' },
      ],
    },
    {
      id: 2, title: 'Linked Lists', order: 1,
      lessons: [
        { slug: 'singly-linked-list', title: 'Singly Linked List', difficulty: 'Easy', summary: 'Nodes with a single next pointer, traversal and basic operations.' },
        { slug: 'doubly-linked-list', title: 'Doubly Linked List', difficulty: 'Medium', summary: 'Nodes with both next and prev pointers for bidirectional traversal.' },
        { slug: 'linked-list-cycle', title: 'Linked List Cycle Detection', difficulty: 'Medium', summary: 'Detect cycles using Floyd\'s slow and fast pointer algorithm.' },
      ],
    },
    {
      id: 3, title: 'Stacks & Queues', order: 2,
      lessons: [
        { slug: 'stack-basics', title: 'Stack Basics', difficulty: 'Easy', summary: 'LIFO structure, push, pop, peek operations and use cases.' },
        { slug: 'queue-basics', title: 'Queue Basics', difficulty: 'Easy', summary: 'FIFO structure, enqueue, dequeue and circular queue.' },
        { slug: 'monotonic-stack', title: 'Monotonic Stack', difficulty: 'Hard', summary: 'Maintain increasing or decreasing order for next greater element problems.' },
      ],
    },
    {
      id: 4, title: 'Trees & Graphs', order: 3,
      lessons: [
        { slug: 'binary-tree', title: 'Binary Tree', difficulty: 'Medium', summary: 'Tree with at most two children, traversal methods: inorder, preorder, postorder.' },
        { slug: 'binary-search-tree', title: 'Binary Search Tree', difficulty: 'Medium', summary: 'BST property, insertion, deletion, and search operations.' },
        { slug: 'graph-bfs-dfs', title: 'Graph BFS & DFS', difficulty: 'Hard', summary: 'Breadth-first and depth-first traversal for graphs.' },
      ],
    },
  ],
};

export default function SubjectDetail() {
  const { slug } = useParams();
  const [subject, setSubject] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTopicSelect = (topic) => {
    setActiveTopic(topic);
    setActiveLesson(null);
    setSidebarOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    getSubject(slug)
      .then((res) => {
        const data = res.data;
        setSubject(data);
        if (data.topics?.length > 0) setActiveTopic(data.topics[0]);
      })
      .catch(() => {
        setSubject(DUMMY);
        setActiveTopic(DUMMY.topics[0]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex h-full animate-pulse">
      <div className="hidden lg:block w-64 shrink-0 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" />
      <div className="flex-1 p-6 sm:p-10 space-y-4">
        <div className="h-10 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />
        {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
      </div>
    </div>
  );

  const topics = subject?.topics ?? [];
  const displayTopic = activeTopic ?? topics[0] ?? null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-6 pb-4 px-4 sm:px-6 flex items-center gap-3">
        <button
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle topics"
        >
          <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 origin-center ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 ${sidebarOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all duration-300 origin-center ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{subject?.title}</h2>
        </div>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700" />

      {/* Mobile drawer — backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer — panel */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-50 lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Topics</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close topics"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            topics={topics}
            activeTopic={activeTopic}
            onTopicSelect={handleTopicSelect}
            activeLesson={activeLesson}
            onLessonSelect={(lesson) => { setActiveLesson(lesson); setSidebarOpen(false); }}
          />
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex">
          <Sidebar
            topics={topics}
            activeTopic={activeTopic}
            onTopicSelect={handleTopicSelect}
            activeLesson={activeLesson}
            onLessonSelect={setActiveLesson}
          />
        </div>
        {activeLesson ? (
          <LessonContent
            lesson={activeLesson}
            allLessons={displayTopic?.lessons ?? []}
            onLessonSelect={setActiveLesson}
            onBack={() => setActiveLesson(null)}
          />
        ) : (
          <LessonList topic={displayTopic} onLessonSelect={setActiveLesson} />
        )}
      </div>
    </div>
  );
}
