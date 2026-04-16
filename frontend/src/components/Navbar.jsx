import { Link } from 'react-router-dom';
import { BookOpen, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Navbar() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem('visited')) {
      api.post('visits/track/').then(r => {
        setVisits(r.data.count);
        sessionStorage.setItem('visited', '1');
      });
    } else {
      api.get('visits/count/').then(r => setVisits(r.data.count));
    }
  }, []);

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
        {visits && (
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Eye size={15} />
            <span>{visits.toLocaleString()}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
