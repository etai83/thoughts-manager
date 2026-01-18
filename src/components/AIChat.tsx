'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatWithGraph = useStore((s) => s.chatWithGraph);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(null);
    const res = await chatWithGraph(question);
    setAnswer(res);
    setIsLoading(false);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-sm flex items-center gap-2"
        >
          <span>✨</span> Ask your Graph
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border w-[500px] overflow-hidden flex flex-col">
          <div className="bg-purple-600 text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
            Graph Assistant
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
          </div>

          <div className="p-4 flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {answer && (
              <div className="bg-gray-50 p-3 rounded border text-xs text-black prose prose-slate max-w-none">
                {answer}
              </div>
            )}
            {isLoading && (
              <div className="text-xs text-gray-500 italic animate-pulse">
                Consulting your thoughts...
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} className="p-4 border-t flex gap-2 bg-gray-50">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              placeholder="How do these ideas relate? What are the key takeaways?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
