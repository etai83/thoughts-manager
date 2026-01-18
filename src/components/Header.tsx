import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b border-solid border-[#283639] px-6 py-3 bg-background-dark/80 backdrop-blur-md z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined font-bold">hub</span>
          </div>
          <div>
            <h1 className="text-white text-base font-bold leading-tight tracking-tight uppercase">ThoughtsManager</h1>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              <p className="text-[#9db4b9] text-[10px] font-medium uppercase tracking-widest">Ollama Active: Llama 3</p>
            </div>
          </div>
        </div>
        <div className="h-8 w-px bg-[#283639]"></div>
        <div className="flex items-center gap-6">
          <button className="text-primary text-sm font-semibold tracking-wide border-b-2 border-primary pb-1">Graph Workspace</button>
          <button className="text-[#9db4b9] text-sm font-medium hover:text-white transition-colors">Semantic Map</button>
          <button className="text-[#9db4b9] text-sm font-medium hover:text-white transition-colors">History</button>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-4">
        <label className="flex flex-col min-w-[300px] h-9">
          <div className="flex w-full flex-1 items-stretch rounded-lg bg-[#283639] border border-white/5">
            <div className="text-[#9db4b9] flex items-center justify-center pl-3">
              <span className="material-symbols-outlined text-sm">search</span>
            </div>
            <input className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-[#9db4b9]/50 text-white px-2 focus:outline-none" placeholder="Jump to thought (⌘K)"/>
          </div>
        </label>
        <div className="flex gap-2">
          <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#283639] text-white border border-white/5 hover:bg-[#34464a]">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#283639] text-white border border-white/5 hover:bg-[#34464a]">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="size-9 rounded-full border-2 border-[#283639] overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAk_iX8gphDy3kAE2PyqA_iv4YNic4o36r8v7PUpxd4_U0qKOUMt4V_aHqM8XUGqxzYeyiq0qIcgEwTxtD3HaKZCVj3JQQ_81Z8yJrFCWi9HR2-S4ZqoLe7xE5UGX0D3F92r7DyBS3hkCEczb6owPi1TJ0_YgJIgDl-xA7sGogA7MRqoQTNpzAr7NO6AQwSre_4tgKh5Ro650O9iUUH43eDaMdfpOSDHoYZQ6WH4LA7trg3IrS6zsb4-KexASzOGwAzVj96iEvJTK0")' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
