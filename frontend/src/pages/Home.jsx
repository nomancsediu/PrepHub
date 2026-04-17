import { useEffect, useState } from 'react';
import { getSubjects } from '../services/api';
import CourseCard, { CourseCardSkeleton } from '../components/CourseCard';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data.results ?? res.data))
      .catch(() => setError('Failed to load courses. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="px-4 sm:px-8 lg:px-[100px] py-8">
      {error && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
        >
          {error}
        </div>
      )}

      {!loading && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Courses ({subjects.length})</h2>
        </div>
      )}

      {loading ? (
        <CourseCardSkeleton />
      ) : (
        <section
          aria-label="Course list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {subjects.map((subject) => (
            <CourseCard key={subject.slug} subject={subject} />
          ))}
        </section>
      )}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-center text-gray-400 mt-20 text-sm">
          No courses available yet.
        </p>
      )}
    </main>
  );
}
