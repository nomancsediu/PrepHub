import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-700/60 shadow-lg">
      <div className="px-4 sm:px-8 lg:px-[100px] h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight hover:text-blue-400 transition-colors duration-200"
        >
          <BookOpen size={24} className="text-blue-400" aria-hidden="true" />
          PrepHub
        </Link>

      </div>
    </nav>
  );
}
