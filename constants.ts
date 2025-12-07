import type { InventoryItem } from './types';

// Helper to add days to current date
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Organic Milk',
    quantity: 500,
    unit: 'ml',
    expiryDate: addDays(1), // Expiring tomorrow
    category: 'Dairy',
    freshness: 15,
    stockLevel: 25,
    price: 1.89
  },
  {
    id: '2',
    name: 'Fusilli Pasta',
    quantity: 500,
    unit: 'g',
    expiryDate: addDays(180),
    category: 'Pantry',
    freshness: 100,
    stockLevel: 100,
    price: 2.50
  },
  {
    id: '3',
    name: 'Bell Peppers',
    quantity: 3,
    unit: 'pcs',
    expiryDate: addDays(5),
    category: 'Produce',
    freshness: 60,
    stockLevel: 60,
    price: 3.20
  },
  {
    id: '4',
    name: 'Avocado',
    quantity: 1,
    unit: 'pcs',
    expiryDate: addDays(2),
    category: 'Produce',
    freshness: 20, // Close to spoiling
    stockLevel: 10,
    price: 1.50
  }
];

export const MOCK_SCANNED_ITEMS: InventoryItem[] = [
  {
    id: '5',
    name: 'Greek Yogurt',
    quantity: 400,
    unit: 'g',
    expiryDate: addDays(10),
    category: 'Dairy',
    freshness: 95,
    stockLevel: 100,
    price: 2.20
  },
  {
    id: '6',
    name: 'Sourdough Bread',
    quantity: 1,
    unit: 'loaf',
    expiryDate: addDays(4),
    category: 'Pantry',
    freshness: 90,
    stockLevel: 100,
    price: 3.50
  },
  {
    id: '7',
    name: 'Spinach',
    quantity: 200,
    unit: 'g',
    expiryDate: addDays(6),
    category: 'Produce',
    freshness: 85,
    stockLevel: 100,
    price: 1.99
  },
  {
    id: '8',
    name: 'Oat Milk',
    quantity: 1,
    unit: 'L',
    expiryDate: addDays(14),
    category: 'Beverage',
    freshness: 100,
    stockLevel: 100,
    price: 2.80
  }
];

export const MOCK_VIDEO_ITEMS: InventoryItem[] = [
  {
    id: '9',
    name: 'Leftover Pizza',
    quantity: 2,
    unit: 'slices',
    expiryDate: addDays(1),
    category: 'Snack',
    freshness: 30,
    stockLevel: 20,
    price: 0.00
  },
  {
    id: '10',
    name: 'Carrots',
    quantity: 500,
    unit: 'g',
    expiryDate: addDays(7),
    category: 'Produce',
    freshness: 80,
    stockLevel: 80,
    price: 1.20
  }
];