import { create } from 'zustand';
import { api } from './api';

export interface Invoice {
  id: string;
  patientId: string;
  totalAmount: number;
  status: string;
  dueDate: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface BillingState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  fetchInvoices: (params?: Record<string, string>) => Promise<void>;
  createInvoice: (data: Partial<Invoice>) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<Invoice>;
}

export const useBillingStore = create<BillingState>((set) => ({
  invoices: [],
  isLoading: false,
  error: null,

  fetchInvoices: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ data: Invoice[] }>('/billing/invoices', params);
      set({ invoices: res.data, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch invoices',
        isLoading: false,
      });
    }
  },

  createInvoice: async (data: Partial<Invoice>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<{ data: Invoice }>('/billing/invoices', data);
      set((state) => ({
        invoices: [res.data, ...state.invoices],
        isLoading: false,
      }));
      return res.data;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to create invoice',
        isLoading: false,
      });
      throw err;
    }
  },

  updateInvoice: async (id: string, data: Partial<Invoice>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.patch<{ data: Invoice }>(`/billing/invoices/${id}`, data);
      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? res.data : i)),
        isLoading: false,
      }));
      return res.data;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update invoice',
        isLoading: false,
      });
      throw err;
    }
  },
}));
