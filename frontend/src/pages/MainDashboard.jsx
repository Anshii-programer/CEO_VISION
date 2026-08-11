import React, { useState } from 'react';
import EnterpriseDash from './verticals/EnterpriseDash';
import StartupDash from './verticals/StartupDash';
import EcommerceDash from './verticals/EcommerceDash';
import HealthcareDash from './verticals/HealthcareDash';

export default function MainDashboard() {
  const [activeVertical, setActiveVertical] = useState('enterprise');
  const [activeTab, setActiveTab] = useState('Dash');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const renderVerticalUI = () => {
    switch (activeVertical) {
      case 'enterprise':
        return <EnterpriseDash />;
      case 'startup':
        return <StartupDash />;
      case 'ecommerce':
        return <EcommerceDash />;
      case 'healthcare':
        return <HealthcareDash />;
      default:
        return <EnterpriseDash />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0E1526] border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white mx-auto text-xl shadow-lg shadow-purple-500/30">
              ⚡
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">CEO VISION CRM</h2>
            <p className="text-xs text-slate-400">Sign in to access vertical analytics</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Work Email</label>
              <input type="email" defaultValue="admin@ceovision.com" className="w-full bg-[#121929] border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-purple-500" required />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Password</label>
              <input type="password" defaultValue="••••••••" className="w-full bg-[#121929] border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-purple-500" required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all">
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans flex overflow-hidden selection:bg-purple-500/30">
      <aside className="w-60 bg-[#0B101D]/90 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between p-4 z-20 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 text-xs">
              ⚡
            </div>
            <h1 className="font-bold text-xs tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
              AI CRM
            </h1>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'Dash', name: 'Dashboard', icon: '📊' },
              { id: 'Clients', name: 'Clients', icon: '👥' },
              { id: 'Leads', name: 'Leads', icon: '🎯' },
              { id: 'Deals', name: 'Deals', icon: '💼' },
              { id: 'Stats', name: 'Analytics', icon: '📈' },
              { id: 'Set', name: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/10 text-white border border-purple-500/40 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-2.5 rounded-xl bg-[#101728]/80 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
              JS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">John Smith</p>
              <p className="text-[10px] text-slate-400 truncate">Admin</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            title="Logout"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            🚪
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 bg-[#0B101D]/70 backdrop-blur-md border-b border-slate-800/60 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 bg-[#121929] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 w-72">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search leads, deals... (Ctrl+K)"
              className="bg-transparent border-none outline-none text-slate-200 text-xs w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={activeVertical}
              onChange={(e) => setActiveVertical(e.target.value)}
              className="bg-[#121929] text-purple-300 font-semibold text-xs rounded-lg px-3 py-1.5 border border-purple-500/40 focus:outline-none cursor-pointer"
            >
              <option value="enterprise">🏢 Enterprise Field</option>
              <option value="startup">🚀 Startup Hub</option>
              <option value="ecommerce">🛒 E-Commerce</option>
              <option value="healthcare">🏥 Healthcare OPD</option>
            </select>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {activeTab === 'Dash' && (
            <>
              {renderVerticalUI()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0E1526]/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Revenue Analytics Trend</h3>
                      <p className="text-[10px] text-slate-400">Real-time performance forecasting</p>
                    </div>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-medium">
                      2026 Live
                    </span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { month: 'Jan', val: '40%' },
                      { month: 'Feb', val: '65%' },
                      { month: 'Mar', val: '50%' },
                      { month: 'Apr', val: '85%' },
                      { month: 'May', val: '70%' },
                      { month: 'Jun', val: '95%' },
                      { month: 'Jul', val: '80%' },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                        <div className="w-full bg-slate-800/60 rounded-t h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 rounded-t transition-all duration-500 group-hover:brightness-125"
                            style={{ height: bar.val }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-2 font-medium">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0E1526]/90 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 mb-3">AI Conversion Insights</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300">
                        <p className="font-bold flex items-center gap-1.5">
                          ✨ 20 High-Intent Leads
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Enterprise cloud migration proposals have an 88% probability to close this week.
                        </p>
                      </div>

                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
                        <p className="font-bold flex items-center gap-1.5">
                          📈 Pipeline Acceleration
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Conversion velocity is +14% faster than last month.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 text-xs font-semibold rounded-xl border border-purple-500/30 transition-all">
                    Generate Deep Report →
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'Dash' && (
            <div className="bg-[#0E1526]/90 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-xl">
                📌
              </div>
              <h3 className="text-base font-bold text-slate-100">{activeTab} Module View</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Module active state connected.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}