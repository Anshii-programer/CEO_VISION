import React from 'react';

export default function EnterpriseDash() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-100">Enterprise Dashboard 🏢</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">ARR Revenue</p>
          <h3 className="text-xl font-bold text-white mt-1">₹24.8 Cr</h3>
          <p className="text-xs text-emerald-400 mt-1">📈 +18% QoQ</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Fortune 500 Clients</p>
          <h3 className="text-xl font-bold text-white mt-1">42 Accounts</h3>
          <p className="text-xs text-purple-400 mt-1">2 Pending Contract</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Avg Deal Size</p>
          <h3 className="text-xl font-bold text-white mt-1">₹1.2 Cr</h3>
          <p className="text-xs text-cyan-400 mt-1">📈 +8% YoY</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">SLA Performance</p>
          <h3 className="text-xl font-bold text-white mt-1">99.4%</h3>
          <p className="text-xs text-emerald-400 mt-1">Optimal State</p>
        </div>
      </div>
    </div>
  );
}