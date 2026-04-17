import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SubjectDetail from './pages/SubjectDetail';
import LessonDetail from './pages/LessonDetail';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import AiAssistant from './components/AiAssistant';

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className="flex-1 overflow-y-auto">
              <div className="py-10"><Home /></div>
            </div>
            <Footer />
          </div>
        } />
        <Route path="/subjects/:slug" element={
          <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className="flex-1 overflow-hidden">
              <div className="h-full px-4 sm:px-8 lg:px-[100px]"><SubjectDetail /></div>
            </div>
          </div>
        } />
        <Route path="/lessons/:slug" element={
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className="flex-1 overflow-y-auto">
              <div className="py-10"><LessonDetail /></div>
            </div>
            <Footer />
          </div>
        } />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AiAssistant />
    </BrowserRouter>
    </ThemeProvider>
  );
}
