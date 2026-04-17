export default function LessonList({ topic, onLessonSelect }) {

  if (!topic) return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-400 max-w-xs">Topics are being prepared. Check back soon!</p>
      </div>
    </main>
  );

  const lessons = topic.lessons ?? [];
  const firstLesson = lessons[0];

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="px-4 sm:px-8 py-8">

        {/* Topic title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2">
          {topic.title}
        </h1>

        {/* Page count label */}
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          Page List ({lessons.length})
        </div>

        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Coming Soon</h3>
            <p className="text-sm text-gray-400 max-w-xs">Lessons for this topic are being prepared. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.slug}
                role="button"
                tabIndex={0}
                onClick={() => onLessonSelect(lesson)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLessonSelect(lesson)}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 transition-all cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-snug pr-3">
                  {lesson.title}
                </span>
                <svg className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        )}

        {/* Next section */}
        {firstLesson && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onLessonSelect(firstLesson)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLessonSelect(firstLesson)}
            className="mt-10 flex items-center justify-between w-full gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 cursor-pointer group hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Next</span>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{firstLesson.title}</h4>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </main>
  );
}
