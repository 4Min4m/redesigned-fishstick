import React from 'react';
import { LayoutDashboard, Package, ChefHat, ShoppingCart, Activity } from 'lucide-react';
import type { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: 'My Inventory', icon: <Package size={20} /> },
    { id: 'chef', label: 'AI Chef', icon: <ChefHat size={20} /> },
    { id: 'restock', label: 'Auto-Restock', icon: <ShoppingCart size={20} /> }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50 transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Activity className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white hidden md:block">
          Purch<span className="text-emerald-500">AIs</span>
        </span>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`${currentView === item.id ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
            </div>
            <span className="font-medium hidden md:block">{item.label}</span>
            {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 hidden md:block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-300">System Online</span>
            </div>
            <p className="text-xs text-slate-500">v2.4.0 (Stable)</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;