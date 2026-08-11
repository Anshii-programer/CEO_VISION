import React from 'react';

const verticalsList = [
  { id: 'enterprise', label: 'Enterprise Dashboard' },
  { id: 'startup', label: 'Startup Dashboard' },
  { id: 'small-biz', label: 'Small Business Dashboard' },
  { id: 'ecommerce', label: 'E-Commerce Dashboard' },
  { id: 'healthcare', label: 'Healthcare Dashboard' },
  { id: 'education', label: 'Education Dashboard' },
  { id: 'real-estate', label: 'Real Estate Dashboard' },
  { id: 'finance', label: 'Banking / Finance Dashboard' },
];

export default function Header({ activeVertical, setActiveVertical }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0E1322]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Dropdown Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 font-medium">Business Field:</span>
        <select
          value={activeVertical}
          onChange={(e) => setActiveVertical(e.target.value)}
          className="bg-slate-900 border border-indigo-500/40 text-slate-100 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {verticalsList.map((item) => (
            <option key={item.id} value={item.id} className="bg-slate-900 text-slate-200">
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="w-64 relative">
          <input
            type="text"
            placeholder="Search anything... (Ctrl + K)"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-medium shadow-md shadow-indigo-600/20 transition">
          + New
        </button>
      </div>
    </header>
  );
}