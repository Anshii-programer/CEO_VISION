import React from 'react';

export default function HealthcareDash() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-100">Healthcare & OPD Portal 🏥</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">OPD Appointments Today</p>
          <h3 className="text-xl font-bold text-white mt-1">340 Patients</h3>
          <p className="text-xs text-emerald-400 mt-1">85 Completed</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Bed Occupancy Rate</p>
          <h3 className="text-xl font-bold text-indigo-400 mt-1">88%</h3>
          <p className="text-xs text-slate-400 mt-1">24 ICU Beds Available</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Lab Test Queue</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">56 Reports</h3>
          <p className="text-xs text-slate-400 mt-1">Pending Approval</p>
        </div>
        <div className="bg-[#0E1526] p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Monthly Claims</p>
          <h3 className="text-xl font-bold text-cyan-400 mt-1">₹45 L</h3>
          <p className="text-xs text-emerald-400 mt-1">Insurance Cleared</p>
        </div>
      </div>
    </div>
  );
}