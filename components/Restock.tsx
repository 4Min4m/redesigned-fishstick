import React, { useState } from 'react';
import { ShoppingCart, RefreshCw, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import type { InventoryItem } from '../types';

interface RestockProps {
  inventory: InventoryItem[];
  onRestock: (itemIds: string[]) => void;
}

const Restock: React.FC<RestockProps> = ({ inventory, onRestock }) => {
  // STRICT LOGIC: Only show items where Quantity <= MinThreshold
  const restockItems = inventory.filter(item => item.quantity <= (item.minThreshold || 1));
  
  const [retailer, setRetailer] = useState<'Jumbo' | 'SPAR'>('Jumbo');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalPrice = restockItems.reduce((acc, item) => acc + item.price, 0);

  const handleOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
        setIsOrdering(false);
        setOrderSuccess(true);
        // After success animation, actually update the inventory
        setTimeout(() => {
            onRestock(restockItems.map(i => i.id));
            setOrderSuccess(false);
        }, 2000);
    }, 1500);
  };

  return (
    <div className="h-full animate-in fade-in duration-500 space-y-8">
       <header className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-white mb-2">Autonomous Restock</h1>
            <p className="text-slate-400">Items below your configured threshold ({restockItems.length} alerts).</p>
         </div>
         <div className="hidden md:block">
            <select 
                value={retailer}
                onChange={(e) => setRetailer(e.target.value as 'Jumbo' | 'SPAR')}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
            >
                <option value="Jumbo">Jumbo Fulfillment</option>
                <option value="SPAR">SPAR QuickConnect</option>
            </select>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">
                <span>Refill Required</span>
                <span>Est. Cost</span>
             </div>
             
             {restockItems.length === 0 ? (
                 <div className="p-12 rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed text-center">
                    <Check className="mx-auto h-12 w-12 text-emerald-500/50 mb-4" />
                    <h3 className="text-lg font-medium text-white">Supply Chain Optimal</h3>
                    <p className="text-slate-400">All items are above their minimum thresholds.</p>
                 </div>
             ) : (
                 <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
                    {restockItems.map((item, idx) => {
                        const isCritical = item.quantity === 0;
                        return (
                            <div key={item.id} className={`p-4 flex items-center justify-between ${idx !== restockItems.length - 1 ? 'border-b border-slate-700/50' : ''} ${isCritical ? 'bg-rose-500/5' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                    <div>
                                        <div className="font-medium text-white flex items-center gap-2">
                                            {item.name}
                                            {isCritical && <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500 text-white font-bold uppercase">Empty</span>}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Current: <span className="text-white font-mono">{item.quantity}</span> / Threshold: <span className="text-slate-300 font-mono">{item.minThreshold || 1}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="font-mono text-slate-300">€{item.price.toFixed(2)}</div>
                            </div>
                        );
                    })}
                 </div>
             )}
        </div>

        {/* Checkout Card */}
        <div className="lg:col-span-1">
             <div className="sticky top-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>Subtotal</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-slate-400 text-sm">
                        <span>Service Fee</span>
                        <span>€2.50</span>
                    </div>
                     <div className="flex justify-between text-slate-400 text-sm">
                        <span>Delivery</span>
                        <span className="text-emerald-400">Free</span>
                    </div>
                    <div className="h-px bg-slate-700/50 my-2"></div>
                     <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>€{(totalPrice > 0 ? totalPrice + 2.50 : 0).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mb-4 block md:hidden">
                    <label className="text-xs text-slate-500 mb-1 block">Retailer</label>
                    <select 
                        value={retailer}
                        onChange={(e) => setRetailer(e.target.value as 'Jumbo' | 'SPAR')}
                        className="w-full bg-slate-900/50 border border-slate-600 text-white text-sm rounded-lg p-2.5"
                    >
                        <option value="Jumbo">Jumbo Fulfillment</option>
                        <option value="SPAR">SPAR QuickConnect</option>
                    </select>
                </div>

                <button
                    onClick={handleOrder}
                    disabled={restockItems.length === 0 || isOrdering || orderSuccess}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                        orderSuccess 
                        ? 'bg-emerald-500 text-white scale-105' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isOrdering ? (
                        <RefreshCw className="animate-spin" />
                    ) : orderSuccess ? (
                        <>
                            <Check className="w-6 h-6" />
                            <span>Order Placed</span>
                        </>
                    ) : (
                        <>
                            <span>Place Order</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
                
                {orderSuccess && (
                     <p className="mt-4 text-xs text-center text-emerald-400 animate-pulse">
                        Authentication verified. Drones dispatched.
                     </p>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Restock;