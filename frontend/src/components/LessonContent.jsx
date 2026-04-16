import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { getLesson, toggleLike } from '../services/api';

export default function LessonContent({ lesson, allLessons, onLessonSelect }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('lesson_lang') || 'en');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const currentIndex = allLessons.findIndex(l => l.slug === lesson.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  useEffect(() => {
    setLoading(true);
    getLesson(lesson.slug)
      .then(res => {
        setContent(res.data);
        setLikes(res.data.likes || 0);
        const likedLessons = JSON.parse(localStorage.getItem('liked_lessons') || '{}');
        setLiked(!!likedLessons[lesson.slug]);
      })
      .catch(() => setContent(lesson))
      .finally(() => setLoading(false));
  }, [lesson.slug]);

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lesson_lang', l);
  };

  const handleLike = () => {
    const action = liked ? 'unlike' : 'like';
    const likedLessons = JSON.parse(localStorage.getItem('liked_lessons') || '{}');
    toggleLike(lesson.slug, action).then(r => {
      setLikes(r.data.likes);
      setLiked(!liked);
      if (!liked) likedLessons[lesson.slug] = true;
      else delete likedLessons[lesson.slug];
      localStorage.setItem('liked_lessons', JSON.stringify(likedLessons));
    });
  };

  const displayContent = lang === 'bn' && content?.content_bn
    ? content.content_bn
    : content?.content;

  const hasBn = !!content?.content_bn;

  if (loading) return (
    <div className="flex-1 overflow-y-auto bg-white px-10 py-10 animate-pulse space-y-4">
      <div className="h-8 w-2/3 bg-gray-200 rounded" />
      {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="px-4 sm:px-8 py-6">

        {/* Language Toggle + Like */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
              liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
            }`}
          >
            <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : ''} />
            <span>{likes}</span>
          </button>
          {hasBn && (
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
              <button
                onClick={() => switchLang('en')}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLang('bn')}
                className={`px-3 py-1.5 transition-colors ${lang === 'bn' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                বাং
              </button>
            </div>
          )}
        </div>

        {displayContent ? (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Coming Soon</h3>
            <p className="text-sm text-gray-400 max-w-xs">This lesson is being prepared. Check back soon!</p>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          {prevLesson ? (
            <button onClick={() => onLessonSelect(prevLesson)}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all min-w-0">
              <ArrowLeft size={15} className="shrink-0 text-gray-400" />
              <div className="min-w-0 text-left">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous</span>
                <span className="truncate block">{prevLesson.title}</span>
              </div>
            </button>
          ) : <div className="flex-1" />}
          {nextLesson ? (
            <button onClick={() => onLessonSelect(nextLesson)}
              className="flex-1 flex items-center justify-between gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all min-w-0">
              <div className="min-w-0 text-right flex-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next</span>
                <span className="truncate block">{nextLesson.title}</span>
              </div>
              <ArrowRight size={15} className="shrink-0 text-gray-400" />
            </button>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </main>
  );
}
