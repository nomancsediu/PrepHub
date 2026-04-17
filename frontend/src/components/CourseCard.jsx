import { BookOpen, ArrowRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
      <div className="h-52 bg-gray-300" />
      <div className="p-7 space-y-4">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
        <div className="h-11 w-36 bg-gray-200 rounded-full mt-4" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export default function CourseCard({ subject }) {
  const navigate = useNavigate();

  const moduleCount = subject.topic_count ?? subject.topics?.length ?? 0;

  const handleCardClick = () => navigate(`/subjects/${subject.slug}`);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${subject.title} — ${moduleCount} modules`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="rounded-lg bg-white dark:bg-gray-800 cursor-pointer outline-none overflow-hidden flex flex-col shadow-md focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {/* Header with SVG */}
      <div className="h-52 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-slate-800 dark:via-blue-950 dark:to-slate-800 flex items-center justify-center">
        <BookOpen size={72} strokeWidth={1.2} className="text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.7)]" aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Layers size={15} aria-hidden="true" className="text-gray-400" />
        <span className="text-sm text-gray-400">{moduleCount} Modules</span>
      </div>

      {/* Course title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 min-h-[3.5rem]">
        {subject.title}
      </h3>

      {/* Read Book button */}
      <button
        type="button"
        aria-label={`Read more about ${subject.title}`}
        onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
        className={[
          'w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold',
          'border-2 border-blue-500 text-blue-500',
          'transition-all duration-200 motion-reduce:transition-none',
          'hover:bg-blue-500 hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        Read Book
        <ArrowRight
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none`}
        />
      </button>
      </div>
    </article>
  );
}
