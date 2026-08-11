import React from 'react';

export default function EcommerceDash() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-100">E-Commerce Store Analytics 🛒</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Daily Gross Sales</p>
          <h3 className="text-xl font-bold text-white mt-1">₹8.4 L</h3>
          <p className="text-xs text-emerald-400 mt-1">📈 +22% vs yesterday</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Pending Orders</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">1,420</h3>
          <p className="text-xs text-slate-400 mt-1">Ready to dispatch</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Cart Abandonment</p>
          <h3 className="text-xl font-bold text-rose-400 mt-1">24.1%</h3>
          <p className="text-xs text-rose-400 mt-1">📉 -3% improved</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">ROAS (Ad Spend)</p>
          <h3 className="text-xl font-bold text-purple-400 mt-1">4.2x</h3>
          <p className="text-xs text-emerald-400 mt-1">High Efficiency</p>
        </div>
      </div>
    </div>
  );
}