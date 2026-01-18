'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatWithGraph = useStore((s) => s.chatWithGraph);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(null);
    
    try {
      const res = await chatWithGraph(question);
      setAnswer(res);
    } catch (error) {
      console.error("Failed to chat with graph:", error);
      setAnswer("Something went wrong while consulting the graph. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#11b4d4] text-[#16181d] px-6 py-3 rounded-full shadow-[0_0_20px_rgba(17,180,212,0.3)] hover:shadow-[0_0_30px_rgba(17,180,212,0.5)] hover:bg-[#0ea5c6] transition-all transform hover:-translate-y-1 font-bold text-sm tracking-wide"
        >
          <span className="material-symbols-outlined text-lg">smart_toy</span>
          <span>CONSULT GRAPH</span>
        </button>
      ) : (
        <div className="glass-panel w-[550px] max-w-[95vw] rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/80 border border-[#11b4d4]/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#11b4d4]/10 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-[#11b4d4]/20">
            <div className="flex items-center gap-2 text-[#11b4d4]">
              <span className="material-symbols-outlined text-lg">hub</span>
              <span className="text-xs font-bold uppercase tracking-widest">Graph Intelligence</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[#11b4d4]/70 hover:text-[#11b4d4] transition-colors p-1 rounded hover:bg-[#11b4d4]/10"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          
          <div className="p-5 flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#16181d]/40 to-[#16181d]/60">
            {!answer && !isLoading && (
              <div className="text-center py-8 text-slate-500 text-sm">
                <p className="mb-2">Ask questions about your thought network.</p>
                <p className="text-xs opacity-60">"How do these ideas relate?" • "Find connections between..."</p>
              </div>
            )}

            {answer && (
              <div className="bg-[#16181d]/80 border border-[#283639] p-4 rounded-lg text-sm text-slate-300 shadow-inner">
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-[#11b4d4] prose-a:text-[#11b4d4] prose-code:text-[#eab308] prose-code:bg-black/30 prose-code:px-1 prose-code:rounded prose-strong:text-white">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#11b4d4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#11b4d4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#11b4d4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-[#11b4d4] font-medium tracking-wide animate-pulse">ANALYZING CONNECTIONS...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} className="p-4 bg-[#16181d]/80 border-t border-[#11b4d4]/20 flex gap-3 backdrop-blur-md">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-[#0f1115] border border-[#283639] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#11b4d4] focus:ring-1 focus:ring-[#11b4d4]/50 transition-all shadow-inner"
              placeholder="Query your knowledge base..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-[#11b4d4] text-[#16181d] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0ea5c6] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(17,180,212,0.2)] hover:shadow-[0_0_15px_rgba(17,180,212,0.4)]"
            >
              ASK
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
