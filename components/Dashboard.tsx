import React, { useState } from 'react';
import { ScanLine, Camera, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { InventoryItem } from '../types';
import { scanReceiptMock, analyzeFridgeMock } from '../services/aiService';

interface DashboardProps {
  inventory: InventoryItem[];
  onAddItems: (items: InventoryItem[]) => void;
  onViewAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, onAddItems, onViewAll }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Metrics
  const totalItems = inventory.length;
  const avgFreshness = Math.round(inventory.reduce((acc, item) => acc + item.freshness, 0) / (totalItems || 1));
  const expiringItems = inventory.filter(item => {
    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 3;
  });

  const handleScan = async () => {
    if (isScanning || isAnalyzing) return;
    setIsScanning(true);
    try {
      const newItems = await scanReceiptMock();
      onAddItems(newItems);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAnalyze = async () => {
    if (isScanning || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const newItems = await analyzeFridgeMock();
      onAddItems(newItems);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Kitchen Overview</h1>
        <p className="text-slate-400">Welcome back. Your kitchen ecosystem is <span className="text-emerald-400">active</span>.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Good</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{avgFreshness}%</div>
            <div className="text-sm text-emerald-200/70">Overall Freshness Score</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{totalItems}</div>
            <div className="text-sm text-slate-400">Total Items Tracked</div>
          </div>
        </div>

         <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
              <AlertTriangle size={24} />
            </div>
            {expiringItems.length > 0 && <span className="animate-pulse w-2 h-2 rounded-full bg-rose-500"></span>}
          </div>
            <div>
              <div className="text-3xl font-bold text-white">{expiringItems.length}</div>
              <div className="text-sm text-rose-200/70">Critical Expiries (&lt; 3 days)</div>
            </div>
        </div>
      </div>

      {/* Action Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Input</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleScan}
              disabled={isScanning || isAnalyzing}
              className="relative overflow-hidden group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center"
            >
              {isScanning ? (
                 <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              ) : (
                <>
                  <div className="p-3 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <ScanLine size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">Scan Receipt</span>
                </>
              )}
            </button>

            <button 
              onClick={handleAnalyze}
              disabled={isScanning || isAnalyzing}
              className="relative overflow-hidden group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center"
            >
               {isAnalyzing ? (
                 <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <>
                  <div className="p-3 rounded-full bg-slate-800 group-hover:bg-blue-500/20 text-slate-300 group-hover:text-blue-400 transition-colors">
                    <Camera size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">Analyze Fridge</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Priority List */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Priority Alerts</h2>
            <button onClick={onViewAll} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">View All Inventory</button>
          </div>
          
          <div className="space-y-3">
            {expiringItems.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm text-center">
                    All clear! Nothing expiring soon.
                </div>
            ) : (
                expiringItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                        {item.freshness}%
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        <div className="text-xs text-rose-300">Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                        {item.quantity} {item.unit}
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;