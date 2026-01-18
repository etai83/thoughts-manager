import React from 'react';

const ContextPanel: React.FC = () => {
  return (
    <aside className="w-[300px] bg-background-dark border-l border-[#283639] flex flex-col z-40 hidden xl:flex shadow-[-4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="p-5 border-b border-[#283639]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[2px] text-[#9db4b9]">Graph Context</h2>
          <span className="px-2 py-0.5 bg-[#283639] rounded text-[10px] text-[#9db4b9] font-bold">SYNCED</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase text-[#9db4b9] tracking-wider mb-1">Active Clusters</div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold">Neural Nets</span>
            <span className="px-2 py-1 bg-[#283639] text-[#9db4b9] border border-white/5 rounded text-[10px] font-bold">LLM Ops</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-[#9db4b9] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">database</span>
            Relevant Notes
          </h3>
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-[#1c2527] border border-white/5 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
              <p className="text-xs font-bold mb-1 group-hover:text-primary text-white">Transformers vs RNNs</p>
              <p className="text-[10px] text-[#9db4b9] line-clamp-1">Comparing attention mechanisms...</p>
            </div>
            <div className="p-3 bg-[#1c2527] border border-white/5 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
              <p className="text-xs font-bold mb-1 group-hover:text-primary text-white">Gradient Descent Theory</p>
              <p className="text-[10px] text-[#9db4b9] line-clamp-1">Mathematics of loss functions...</p>
            </div>
            <div className="p-3 bg-[#1c2527] border border-white/5 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
              <p className="text-xs font-bold mb-1 group-hover:text-primary text-white">Ethics of LLMs</p>
              <p className="text-[10px] text-[#9db4b9] line-clamp-1">Safety protocols and bias...</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-[#9db4b9] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">sell</span>
            Active Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#283639] text-[#9db4b9] text-[10px] font-bold rounded-full border border-white/5 hover:border-primary transition-all cursor-pointer">#research</span>
            <span className="px-3 py-1 bg-[#283639] text-[#9db4b9] text-[10px] font-bold rounded-full border border-white/5 hover:border-primary transition-all cursor-pointer">#draft</span>
            <span className="px-3 py-1 bg-[#283639] text-[#9db4b9] text-[10px] font-bold rounded-full border border-white/5 hover:border-primary transition-all cursor-pointer">#neural-nets</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-[#111718] border-t border-[#283639]">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(17,180,212,0.6)]"></div>
          <span className="text-[10px] text-[#9db4b9] font-bold uppercase tracking-tighter">System Status: Operational</span>
          <span className="ml-auto text-[10px] text-[#9db4b9]/50 font-medium">v1.3.0</span>
        </div>
      </div>
    </aside>
  );
};

export default ContextPanel;
