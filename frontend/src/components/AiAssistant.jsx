import { useState, useRef, useEffect } from 'react';
import { aiChat } from '../services/api';

export default function AiAssistant({ lessonContext = '' }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 50);
    }
  }, [open, history]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    const newHistory = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);
    try {
      const res = await aiChat(msg, lessonContext, history);
      setHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setHistory([...newHistory, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[55] flex flex-col items-end gap-2">

      {/* Chat panel */}
      <div className={`flex flex-col bg-white border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out rounded-xl
        ${open ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 translate-y-3 pointer-events-none scale-95'}
        fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-[340px]
        h-[calc(100svh-160px)] sm:h-[460px] max-h-[540px]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-white">PrepAI</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 px-4">
              <p className="text-sm font-semibold text-gray-700">Ask me anything 👋</p>
              <p className="text-xs text-gray-400">I can help explain concepts you're learning.</p>

            </div>
          )}

          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words
                ${msg.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-gray-100 bg-white flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none px-3 py-2 max-h-20 focus:border-gray-400 transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="shrink-0 w-9 h-9 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all hover:scale-105 active:scale-95 rounded-xl"
        aria-label="Toggle PrepAI"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6C4 4.9 4.9 4 6 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H9l-5 4V6z" fill="#b45309" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="10" cy="12" r="1.5" fill="#fff"/>
            <circle cx="14" cy="12" r="1.5" fill="#ddd6fe"/>
            <circle cx="18" cy="12" r="1.5" fill="#fff"/>
          </svg>
        )}
      </button>

    </div>
  );
}
