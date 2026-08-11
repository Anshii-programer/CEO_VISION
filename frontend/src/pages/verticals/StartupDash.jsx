import React from 'react';

export default function StartupDash() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-100">Startup Growth Hub 🚀</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Monthly Burn Rate</p>
          <h3 className="text-xl font-bold text-rose-400 mt-1">₹12.5 L</h3>
          <p className="text-xs text-slate-400 mt-1">Runway: 18 Months</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">MRR Growth</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">₹4.2 L</h3>
          <p className="text-xs text-emerald-400 mt-1">📈 +34% MoM</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Active Users (MAU)</p>
          <h3 className="text-xl font-bold text-white mt-1">18.4 K</h3>
          <p className="text-xs text-indigo-400 mt-1">📈 +12% this week</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Investor Pitching</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">Series A</h3>
          <p className="text-xs text-slate-400 mt-1">4 Term Sheets In</p>
        </div>
      </div>
    </div>
  );
}