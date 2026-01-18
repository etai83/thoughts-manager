'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { exportToJson, exportToMarkdown, importFromJson } from '@/lib/dataPortability';
import { runLayout } from '@/lib/layout';

const Sidebar: React.FC = () => {
  const {
    nodes,
    edges,
    addNode,
    setNodes,
    loadData,
    clearData,
  } = useStore();

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL thoughts? This action cannot be undone.')) {
      await clearData();
    }
  };

  const handleAddNode = () => {
    const id = Date.now().toString();
    const newNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Thought ${id}`, content: '' },
      type: 'thought',
    };
    addNode(newNode);
  };

  const handleLayout = () => {
    const layoutedNodes = runLayout(nodes, edges);
    setNodes(layoutedNodes);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importFromJson(file);
        await loadData();
      } catch (error) {
        alert('Import failed: ' + (error as Error).message);
      }
    }
  };

  return (
    <aside className="w-[340px] flex flex-col bg-background-dark border-r border-[#283639] z-40 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="p-5 border-b border-[#283639] bg-[#1a1d23]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
            Semantic Discovery
          </h2>
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">4 NEW</span>
        </div>
        <p className="text-[11px] text-[#9db4b9] leading-relaxed">
          AI analysis has detected potential connections between your isolated zones.
        </p>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 py-1.5 bg-[#283639] hover:bg-[#34464a] border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[14px]">tune</span> Configure
          </button>
          <button onClick={handleLayout} className="flex-1 py-1.5 bg-primary text-background-dark rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_10px_rgba(17,180,212,0.3)]">
            Auto-Connect
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <div className="bg-[#1c2527] border border-primary/30 rounded-xl p-4 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">High Confidence</span>
            <span className="text-[10px] text-[#9db4b9] font-mono">94%</span>
          </div>
          <div className="relative pl-3 border-l-2 border-[#283639] ml-1 space-y-3 mb-4">
            <div>
              <div className="text-[10px] text-[#9db4b9] uppercase tracking-wider mb-0.5">Source</div>
              <div className="text-xs font-bold text-white">Project: Neural Networks</div>
            </div>
            <div>
              <div className="text-[10px] text-[#9db4b9] uppercase tracking-wider mb-0.5">Target</div>
              <div className="text-xs font-bold text-white">Cognitive Architecture</div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-[9px] w-4 h-4 rounded-full bg-background-dark border border-primary text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px]">link</span>
            </div>
          </div>
          <div className="bg-black/20 rounded p-2 mb-3 border border-white/5">
            <div className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-primary text-[14px] mt-0.5">psychology</span>
              <p className="text-[11px] text-[#9db4b9] leading-relaxed">
                Both nodes discuss &quot;weight adjustment mechanisms&quot; and Hebbian learning principles.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">add_link</span> Connect
            </button>
            <button className="size-8 flex items-center justify-center border border-white/10 rounded-lg hover:bg-white/5 text-[#9db4b9]">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        <div className="bg-[#1c2527] border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gold-accent tracking-wider uppercase bg-gold-accent/10 px-2 py-0.5 rounded">Inference Pattern</span>
            <span className="text-[10px] text-[#9db4b9] font-mono">78%</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 p-2 bg-[#16181d] rounded border border-white/5 text-center">
              <span className="text-[10px] font-semibold block truncate">Ollama Opt.</span>
            </div>
            <span className="material-symbols-outlined text-[#9db4b9] text-xs">arrow_forward</span>
            <div className="flex-1 p-2 bg-[#16181d] rounded border border-white/5 text-center">
              <span className="text-[10px] font-semibold block truncate">PyTorch Intro</span>
            </div>
          </div>
          <p className="text-[11px] text-[#9db4b9] leading-relaxed mb-3">
            Potential overlap in quantization techniques (int8/fp16) and basic tensor operations detected.
          </p>
          <button className="w-full py-2 bg-[#283639] hover:bg-[#34464a] text-[#9db4b9] hover:text-white border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[14px]">add_link</span> Review Connection
          </button>
        </div>

        <div className="bg-[#1c2527] border border-white/5 rounded-xl p-4 relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 mb-2 text-[#9db4b9]">
            <span className="material-symbols-outlined text-sm">tag</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Tag Suggestion</span>
          </div>
          <p className="text-xs font-semibold text-white mb-1">Add #local-llm to 3 nodes</p>
          <p className="text-[10px] text-[#9db4b9] mb-3">Based on content cluster analysis.</p>
          <button className="text-primary text-[10px] font-bold uppercase hover:underline">Apply to all</button>
        </div>
      </div>

      <div className="p-3 border-t border-[#283639] bg-[#16181d] flex flex-col gap-2">
         <div className="text-[10px] text-[#9db4b9] uppercase tracking-wider mb-1">Actions</div>
         <div className="grid grid-cols-2 gap-2">
            <button onClick={handleAddNode} className="py-2 bg-[#283639] hover:bg-[#34464a] text-white border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">add</span> Add Node
            </button>
            <button onClick={handleDeleteAll} className="py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">delete</span> Reset
            </button>
         </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={exportToJson} className="py-2 bg-[#283639] hover:bg-[#34464a] text-[#9db4b9] border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                Export JSON
            </button>
            <label className="py-2 bg-[#283639] hover:bg-[#34464a] text-[#9db4b9] border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer">
                Import JSON
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
         </div>
      </div>
      
      <div className="p-3 border-t border-[#283639] bg-[#16181d] flex justify-between items-center text-[10px] text-[#9db4b9]">
        <span>Processing Graph...</span>
        <div className="flex gap-1">
          <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
          <span className="size-1.5 bg-primary/50 rounded-full animate-pulse delay-75"></span>
          <span className="size-1.5 bg-primary/20 rounded-full animate-pulse delay-150"></span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
