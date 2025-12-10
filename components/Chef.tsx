import React, { useState, useRef, useEffect } from 'react';
import { ChefHat, Sparkles, Utensils, ArrowRight, Loader2, Zap } from 'lucide-react';
import type { InventoryItem, Recipe } from '../types';
import { suggestRecipeMock } from '../services/aiService';

interface ChefProps {
  inventory: InventoryItem[];
  onCook: (ingredientIds: string[]) => void;
}

const Chef: React.FC<ChefProps> = ({ inventory, onCook }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string | React.ReactNode}[]>([
    { role: 'ai', content: "Hello! I'm your culinary optimization engine. Ask me what to cook based on your expiring inventory." }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async (promptText: string) => {
    setIsThinking(true);
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: promptText }]);
    
    try {
      // Pass the specific prompt to the service
      const recipe = await suggestRecipeMock(inventory, promptText);
      setCurrentRecipe(recipe);
      
      if (recipe) {
        setMessages(prev => [...prev, { 
            role: 'ai', 
            content: (
                <div className="space-y-4">
                    <p>Based on your available inventory, here is a match:</p>
                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="text-lg font-bold text-emerald-400">{recipe.name}</h3>
                             <span className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-400">{recipe.calories} kcal</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-4">{recipe.description}</p>
                        <button 
                            onClick={() => handleCook(recipe)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Utensils size={16} />
                            Cook This Meal
                        </button>
                    </div>
                </div>
            ) 
        }]);
      } else {
        // Fallback for when no items or specific items are missing
        const criticalMissing = inventory.filter(i => i.quantity === 0);
        let msg = "I couldn't find a suitable recipe with your current available stock.";
        if (criticalMissing.length > 0) {
            msg += ` You are out of ${criticalMissing.slice(0, 2).map(i => i.name).join(' and ')}. Please check the Restock tab.`;
        }
        setMessages(prev => [...prev, { role: 'ai', content: msg }]);
      }
    } catch (error) {
       setMessages(prev => [...prev, { role: 'ai', content: "System error calculating recipes." }]);
    } finally {
        setIsThinking(false);
    }
  };

  const handleCook = (recipe: Recipe) => {
    onCook(recipe.ingredientsNeeded);
    setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Excellent choice. I've updated your inventory to reflect the usage of ingredients for ${recipe.name}. Bon Appétit!` 
    }]);
    setCurrentRecipe(null);
  };

  const quickPrompts = ['Quick Lunch', 'Dinner Idea', 'Use expiring items'];

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <ChefHat className="text-emerald-500" size={32} />
                AI Chef Assistant
            </h1>
            <p className="text-slate-400">Context-aware culinary suggestions.</p>
        </header>

        <div className="flex-1 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl flex flex-col overflow-hidden relative">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                                ? 'bg-emerald-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isThinking && (
                     <div className="flex justify-start">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                             <Loader2 size={16} className="animate-spin text-emerald-500" />
                             <span className="text-sm text-slate-400">Analyzing molecular structures...</span>
                        </div>
                     </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700 space-y-4">
                {/* Quick Prompts */}
                {!currentRecipe && !isThinking && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {quickPrompts.map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => handleAsk(prompt)}
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Zap size={12} className="text-emerald-500" />
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Action */}
                {!currentRecipe && (
                    <button 
                        onClick={() => handleAsk("What can I cook with my current ingredients?")}
                        disabled={isThinking}
                        className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Sparkles size={20} className="group-hover:animate-pulse" />
                        Generate Recipe from Inventory
                        <ArrowRight size={20} className="ml-auto opacity-60 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
                {currentRecipe && (
                     <div className="text-center text-xs text-slate-500 py-3">
                        Interaction requires action on suggested recipe.
                     </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Chef;