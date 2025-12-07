import React, { useState, useEffect } from 'react';
import type { InventoryItem, AppView } from './types';
import { INITIAL_INVENTORY } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Chef from './components/Chef';
import Restock from './components/Restock';
import { Bell } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Helper to show toasts
  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 3));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handler: Add items (Scan/Analyze)
  const handleAddItems = (newItems: InventoryItem[]) => {
    setInventory(prev => [...prev, ...newItems]);
    addNotification(`${newItems.length} items added to inventory.`);
  };

  // Handler: Cook (Remove/Decrement items)
  const handleCook = (ingredientIds: string[]) => {
      // In a real app we might decrement quantity. Here we act as if we used the item up or significantly reduced it.
      // We'll reduce quantity by 50% or remove if unit is 1
      setInventory(prev => prev.map(item => {
          if (ingredientIds.includes(item.id)) {
              if (item.quantity <= 1) {
                   // If it's a single item (1 unit), effectively remove it or mark empty
                   // For this demo, let's remove it to show impact
                   return { ...item, quantity: 0, stockLevel: 0, freshness: 0 };
              } else {
                  // Reduce stock
                  return { ...item, quantity: Math.floor(item.quantity * 0.5), stockLevel: Math.floor(item.stockLevel * 0.5) };
              }
          }
          return item;
      }).filter(item => item.quantity > 0)); // Filter out empty items
      
      addNotification("Meal prepared. Inventory updated.");
  };

  // Handler: Restock (Reset levels)
  const handleRestock = (itemIds: string[]) => {
      setInventory(prev => prev.map(item => {
          if (itemIds.includes(item.id)) {
              return { 
                ...item, 
                stockLevel: 100, 
                freshness: 100, 
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Reset expiry to +7 days
            };
          }
          return item;
      }));
      addNotification("Restock order processed successfully.");
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard inventory={inventory} onAddItems={handleAddItems} onViewAll={() => setCurrentView('inventory')} />;
      case 'inventory':
        return <Inventory inventory={inventory} />;
      case 'chef':
        return <Chef inventory={inventory} onCook={handleCook} />;
      case 'restock':
        return <Restock inventory={inventory} onRestock={handleRestock} />;
      default:
        return <Dashboard inventory={inventory} onAddItems={handleAddItems} onViewAll={() => setCurrentView('inventory')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-50 overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px]"></div>
      </div>

      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 ml-20 md:ml-64 relative z-10 h-screen overflow-y-auto">
        {/* Top Mobile Bar / Status Area */}
        <div className="sticky top-0 z-40 px-6 py-4 flex justify-end md:hidden bg-slate-900/80 backdrop-blur-md">
             <div className="text-emerald-500 font-bold">PurchAIs</div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
            {renderContent()}
        </div>
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-800 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-full">
                <Bell size={18} />
            </div>
            <div>
                <p className="font-semibold text-sm">{notifications[0]}</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default App;