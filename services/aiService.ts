import type { InventoryItem, Recipe } from '../types';
import { MOCK_SCANNED_ITEMS, MOCK_VIDEO_ITEMS } from '../constants';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scanReceiptMock = async (): Promise<InventoryItem[]> => {
  await delay(2000);
  // Return a fresh copy with new IDs to avoid conflicts if scanned multiple times
  return MOCK_SCANNED_ITEMS.map(item => ({
    ...item,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }));
};

export const analyzeFridgeMock = async (): Promise<InventoryItem[]> => {
  await delay(2000);
  return MOCK_VIDEO_ITEMS.map(item => ({
    ...item,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }));
};

export const suggestRecipeMock = async (inventory: InventoryItem[]): Promise<Recipe | null> => {
  await delay(1500);

  // AI Logic: Check for critical items
  const expiringDairy = inventory.find(i => i.category === 'Dairy' && i.freshness < 30);
  const pasta = inventory.find(i => i.name.toLowerCase().includes('pasta'));
  
  if (expiringDairy && expiringDairy.name.toLowerCase().includes('milk')) {
    return {
      id: 'rec_1',
      name: 'Fluffy Pancakes',
      description: `Your ${expiringDairy.name} is about to turn! Use it to make delicious breakfast pancakes.`,
      ingredientsNeeded: [expiringDairy.id], // ID of item to consume
      calories: 450
    };
  }

  if (pasta) {
    return {
      id: 'rec_2',
      name: 'Pasta Primavera',
      description: 'A classic way to use up fresh vegetables and your pasta stock.',
      ingredientsNeeded: [pasta.id],
      calories: 600
    };
  }

  return {
    id: 'rec_3',
    name: 'Kitchen Sink Salad',
    description: 'Combine all your remaining produce for a healthy detox bowl.',
    ingredientsNeeded: [],
    calories: 320
  };
};