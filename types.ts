export type Category = 'Dairy' | 'Produce' | 'Pantry' | 'Protein' | 'Beverage' | 'Snack';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number; // For display, e.g., 500
  unit: string;     // e.g., "g", "ml", "pcs"
  expiryDate: string; // ISO Date string
  category: Category;
  freshness: number; // 0 to 100
  stockLevel: number; // 0 to 100 (Representation of how full the container/stock is)
  price: number; // Estimated price in Euro
  image?: string; // Optional URL for visual
  minThreshold?: number; // Minimum quantity before restock is triggered
}

export type AppView = 'dashboard' | 'inventory' | 'chef' | 'restock';

export interface Recipe {
  id: string;
  name: string;
  ingredientsNeeded: string[];
  description: string;
  calories: number;
}