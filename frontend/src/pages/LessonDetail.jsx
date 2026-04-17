import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, getAdjacentLessons, toggleLike } from '../services/api';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';

const DUMMY_LESSON = {
  title: 'Array Basics',
  difficulty: 'Easy',
  summary: 'Learn the fundamentals of arrays including indexing, traversal, and basic operations.',
  content: `## Introduction

Arrays are one of the most fundamental data structures in computer science. An array stores elements in contiguous memory locations, allowing efficient access by index.

## Key Concepts

- **Indexing**: Access elements using zero-based index
- **Traversal**: Iterate through all elements
- **Insertion**: Add elements at specific positions
- **Deletion**: Remove elements from specific positions

## Example

\`\`\`python
# Creating an array
arr = [1, 2, 3, 4, 5]

# Accessing elements
print(arr[0])  # Output: 1

# Traversal
for item in arr:
    print(item)
\`\`\`

## Time Complexity

| Operation | Complexity |
|-----------|------------|
| Access    | O(1)       |
| Search    | O(n)       |
| Insert    | O(n)       |
| Delete    | O(n)       |
`,
};

const DUMMY_ADJACENT = {
  previous: null,
  next: { slug: 'two-pointer-technique', title: 'Two Pointer Technique' },
};

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [adjacent, setAdjacent] = useState({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('lesson_lang') || 'en');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const switchLang = (l) => { setLang(l); localStorage.setItem('lesson_lang', l); };

  const handleLike = () => {
    const action = liked ? 'unlike' : 'like';
    const likedLessons = JSON.parse(localStorage.getItem('liked_lessons') || '{}');
    toggleLike(slug, action).then(r => {
      setLikes(r.data.likes);
      setLiked(!liked);
      if (!liked) likedLessons[slug] = true;
      else delete likedLessons[slug];
      localStorage.setItem('liked_lessons', JSON.stringify(likedLessons));
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getLesson(slug), getAdjacentLessons(slug)])
      .then(([lessonRes, adjRes]) => {
        setLesson(lessonRes.data);
        setAdjacent(adjRes.data);
        setLikes(lessonRes.data.likes || 0);
        const likedLessons = JSON.parse(localStorage.getItem('liked_lessons') || '{}');
        setLiked(!!likedLessons[slug]);
      })
      .catch(() => {
        setLesson(DUMMY_LESSON);
        setAdjacent(DUMMY_ADJACENT);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-8 py-10 animate-pulse space-y-4">
      <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
      {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
            lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            lesson.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {lesson.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
        {lesson.summary && (
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-base leading-relaxed">{lesson.summary}</p>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700 mb-8" />

      {/* Language Toggle + Like */}
      <div className="flex items-center justify-between mb-4">
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
              liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-300 hover:text-red-400'
            }`}
          >
            <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : ''} />
            <span>{likes}</span>
          </button>

        {lesson.content_bn ? (
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm font-medium">
            <button onClick={() => switchLang('en')}
              className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-gray-900 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              EN
            </button>
            <button onClick={() => switchLang('bn')}
              className={`px-3 py-1.5 transition-colors ${lang === 'bn' ? 'bg-gray-900 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              বাং
            </button>
          </div>
        ) : <div />}
      </div>

      {/* Content */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: (lang === 'bn' && lesson.content_bn ? lesson.content_bn : lesson.content) ?? '<p>No content available.</p>' }}
      />

      {/* Navigation */}
      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        {adjacent.previous ? (
          <button
            onClick={() => navigate(`/lessons/${adjacent.previous.slug}`)}
            className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-w-0"
          >
            <ArrowLeft size={16} className="shrink-0 text-gray-400" />
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous</span>
              <span className="truncate block">{adjacent.previous.title}</span>
            </div>
          </button>
        ) : <div className="flex-1" />}

        {adjacent.next && (
          <button
            onClick={() => navigate(`/lessons/${adjacent.next.slug}`)}
            className="flex-1 flex items-center justify-between gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-w-0"
          >
            <div className="min-w-0 text-right flex-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next</span>
              <span className="truncate block">{adjacent.next.title}</span>
            </div>
            <ArrowRight size={16} className="shrink-0 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
