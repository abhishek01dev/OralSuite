import { create } from 'zustand';
import { api } from './api';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (params?: Record<string, string>) => Promise<void>;
  updateStock: (itemId: string, quantity: number, type: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ data: InventoryItem[] }>('/inventory', params);
      set({ items: res.data, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch inventory',
        isLoading: false,
      });
    }
  },

  updateStock: async (itemId, quantity, type) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/inventory/${itemId}/transactions`, { quantity, type });
      // Re-fetch to get updated numbers
      const res = await api.get<{ data: InventoryItem[] }>('/inventory');
      set({ items: res.data, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update stock',
        isLoading: false,
      });
      throw err;
    }
  },
}));
