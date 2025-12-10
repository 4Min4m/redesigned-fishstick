import React from 'react';
import type { InventoryItem } from '../types';
import { Clock, Tag, X, Settings2 } from 'lucide-react';

interface InventoryProps {
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onUpdateThreshold: (id: string, value: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onDelete, onUpdateThreshold }) => {
  const getFreshnessColor = (val: number) => {
    if (val === 0) return 'bg-slate-700'; // Empty/Dead
    if (val > 70) return 'bg-emerald-500';
    if (val > 30) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getFreshnessText = (val: number) => {
    if (val === 0) return 'text-slate-500';
    if (val > 70) return 'text-emerald-400';
    if (val > 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Neural Inventory</h1>
        <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
            {inventory.length} items synced
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {inventory.map((item) => (
          <div 
            key={item.id} 
            className={`group relative overflow-hidden rounded-2xl bg-white/5 border p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:-translate-y-1 ${
                item.quantity === 0 ? 'border-rose-500/30 bg-rose-500/5 opacity-80' : 'border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
            }`}
          >
            {/* Delete Button */}
            <button 
                onClick={() => onDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Remove Item"
            >
                <X size={14} />
            </button>

            {/* Category Pill */}
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-slate-800/80 backdrop-blur text-[10px] text-slate-300 border border-slate-700 uppercase tracking-wider group-hover:opacity-0 transition-opacity">
              {item.category}
            </div>

            {/* Header */}
            <div className="mb-4 pr-6">
              <h3 className={`text-lg font-bold transition-colors truncate ${item.quantity === 0 ? 'text-rose-400 line-through' : 'text-white group-hover:text-emerald-300'}`}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                <Tag size={12} />
                <span>{item.quantity} {item.unit}</span>
                {item.quantity === 0 && <span className="text-rose-400 font-bold ml-1">(OUT)</span>}
              </div>
            </div>

            {/* Freshness Meter */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Vitality</span>
                <span className={`font-mono ${getFreshnessText(item.freshness)}`}>{item.freshness}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getFreshnessColor(item.freshness)}`}
                  style={{ width: `${item.freshness}%` }} 
                />
              </div>
            </div>

            {/* Footer & Threshold Control */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
               <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span>{new Date(item.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-slate-500 font-mono">€{item.price.toFixed(2)}</span>
               </div>
               
               {/* Threshold Input */}
               <div className="flex items-center justify-between bg-slate-900/40 rounded-lg p-2 border border-white/5">
                   <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
                       <Settings2 size={10} />
                       Min Stock
                   </div>
                   <input 
                        type="number" 
                        min="0"
                        value={item.minThreshold || 1}
                        onChange={(e) => onUpdateThreshold(item.id, parseInt(e.target.value) || 0)}
                        className="w-12 bg-slate-800 text-right text-xs text-white rounded px-1 py-0.5 border border-slate-700 focus:border-emerald-500 focus:outline-none"
                   />
               </div>
            </div>
          </div>
        ))}
        
        {/* Empty State visual if needed */}
        {inventory.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                No items in memory. Scan a receipt or use the camera.
            </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;