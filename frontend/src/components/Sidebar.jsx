import { useState } from 'react';

export default function Sidebar({ topics, activeTopic, onTopicSelect, activeLesson, onLessonSelect }) {
  const effectiveActive = activeTopic ?? topics[0] ?? null;
  const [expandedId, setExpandedId] = useState(effectiveActive?.id ?? null);

  const handleTopicClick = (topic) => {
    const isExpanded = expandedId === topic.id;
    setExpandedId(isExpanded ? null : topic.id);
    onTopicSelect(topic);
  };

  return (
    <aside className="w-64 shrink-0 h-full bg-white flex flex-col overflow-y-auto border-r border-gray-200 py-4 px-3">
      <nav className="flex flex-col gap-1">
        {topics.map((topic) => {
          const isActive = effectiveActive?.id === topic.id;
          const isExpanded = expandedId === topic.id;
          const lessons = topic.lessons ?? [];
          return (
            <div key={topic.id}>
              <button
                type="button"
                onClick={() => handleTopicClick(topic)}
                className={[
                  'flex items-center justify-between px-4 py-2 w-full rounded-lg text-left transition-colors cursor-pointer',
                  isActive ? 'bg-white border border-blue-100 shadow-sm' : 'hover:bg-gray-50 border border-transparent',
                ].join(' ')}
              >
                <span className={[
                  'text-[14px] font-medium leading-tight max-w-[85%]',
                  isActive ? 'text-blue-600 font-bold text-[15px]' : 'text-gray-500',
                ].join(' ')}>
                  {topic.title}
                </span>
                <svg
                  className={`shrink-0 w-4 h-4 transition-transform ${isActive ? 'text-blue-600' : 'text-gray-300'} ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {isExpanded && lessons.length > 0 && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5">
                  {lessons.map((lesson) => {
                    const isLessonActive = activeLesson?.slug === lesson.slug;
                    return (
                      <button
                        key={lesson.slug}
                        type="button"
                        onClick={() => onLessonSelect(lesson)}
                        className={[
                          'w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors',
                          isLessonActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50',
                        ].join(' ')}
                      >
                        {lesson.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
