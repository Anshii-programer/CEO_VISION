import React from 'react';

export default function Sidebar() {
  const menuItems = ['Dashboard', 'Clients', 'Leads', 'Projects', 'Deals', 'Tasks', 'Analytics', 'Settings'];

  return (
    <aside className="w-56 border-r border-slate-800/80 bg-[#0E1322] flex flex-col justify-between p-4 sticky top-0 h-screen">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">AI CRM</h1>
            <p className="text-[10px] text-slate-400 font-medium">Enterprise UI</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 text-xs">
          {menuItems.map((item, idx) => (
            <button
              key={item}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-medium transition ${
                idx === 0 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
          JS
        </div>
        <div className="text-xs">
          <p className="font-semibold text-slate-200">John Smith</p>
          <p className="text-[10px] text-slate-400">Admin</p>
        </div>
      </div>
    </aside>
  );
}