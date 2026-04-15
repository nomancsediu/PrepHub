import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">

      <h1 className="text-[140px] sm:text-[200px] font-black leading-none select-none bg-gradient-to-b from-gray-600 to-gray-900 bg-clip-text text-transparent mb-2">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-500 text-sm sm:text-base max-w-sm mb-10 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
          </svg>
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-800 text-gray-400 text-sm font-semibold hover:border-gray-600 hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      <p className="mt-16 text-xs text-gray-800 tracking-widest uppercase">PrepHub</p>
    </div>
  );
}
