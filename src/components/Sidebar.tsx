'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { exportToJson, exportToMarkdown, importFromJson } from '@/lib/dataPortability';
import pkg from '../../package.json';
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
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col gap-6 shadow-lg z-20 overflow-y-auto text-black shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-lg leading-tight">Thoughts</h1>
          <span className="text-[10px] text-gray-400">Manager v{pkg.version}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Actions</h2>
        <button
          onClick={handleAddNode}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center gap-3 font-semibold text-sm"
        >
          <span className="text-xl">+</span> Add Thought
        </button>
        <button
          onClick={handleLayout}
          className="w-full bg-stone-50 text-stone-700 px-4 py-2.5 rounded-xl hover:bg-stone-100 hover:scale-[1.02] active:scale-[0.98] transition-all border border-stone-200 flex items-center gap-3 font-semibold text-sm shadow-sm"
        >
          <span className="text-lg">⚙</span> Auto Layout
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Experience</h2>
        <div className="text-xs text-gray-500 px-1 leading-relaxed">
          Use semantic search at the top or ask the AI assistant for insights.
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto border-t pt-6">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Data</h2>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={exportToJson}
            className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors flex items-center justify-between group"
          >
            <span>Export JSON</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
          </button>
          <button
            onClick={exportToMarkdown}
            className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors flex items-center justify-between group"
          >
            <span>Export Markdown</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
          </button>
          <label className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer flex items-center justify-between group">
            <span>Import JSON</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↑</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleDeleteAll}
            className="w-full text-left px-3 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors flex items-center justify-between group mt-2"
          >
            <span>Delete All Thoughts</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">🗑️</span>
          </button>
        </div>
      </div>
      
      <div className="pt-4 text-[10px] text-gray-400 text-center italic">
        Think spatially.
      </div>
    </div>
  );
};

export default Sidebar;
