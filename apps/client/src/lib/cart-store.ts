import { create } from 'zustand';
import { api } from './api';

const GUEST_CART_KEY = 'guest_cart';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;

  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;

  syncToServer: () => Promise<void>;
  mergeOnLogin: () => Promise<void>;
  loadCart: () => void;
}

const persistToLocal = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const loadFromLocal = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      let next: CartItem[];

      if (existing) {
        next = state.items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      } else {
        next = [...state.items, { ...item, quantity }];
      }

      persistToLocal(next);
      return { items: next };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const next = state.items.filter((i) => i.productId !== productId);
      persistToLocal(next);
      return { items: next };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => {
      const next = state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      persistToLocal(next);
      return { items: next };
    });
  },

  clearCart: () => {
    persistToLocal([]);
    set({ items: [] });
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  syncToServer: async () => {
    const { items } = get();
    if (items.length === 0) return;

    try {
      await api.post('/cart/sync', {
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      });
    } catch {
      // Sync failures are non-blocking for the user
    }
  },

  /**
   * Called after login. Fetches the server-side cart, merges with
   * local guest cart (guest quantities take priority), pushes merged
   * cart to server, then clears localStorage guest cart.
   */
  mergeOnLogin: async () => {
    set({ isLoading: true });
    const localItems = get().items;

    try {
      const res = await api.get<{ data: { items: CartItem[] } }>('/cart');
      const serverItems = res.data?.items ?? [];

      const merged = new Map<string, CartItem>();

      for (const item of serverItems) {
        merged.set(item.productId, { ...item });
      }

      // Guest items override server quantities
      for (const item of localItems) {
        merged.set(item.productId, { ...item });
      }

      const mergedItems = Array.from(merged.values());

      if (mergedItems.length > 0) {
        await api.post('/cart/sync', {
          items: mergedItems.map(({ productId, quantity }) => ({ productId, quantity })),
        });
      }

      localStorage.removeItem(GUEST_CART_KEY);
      set({ items: mergedItems, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadCart: () => {
    const items = loadFromLocal();
    set({ items });
  },
}));
