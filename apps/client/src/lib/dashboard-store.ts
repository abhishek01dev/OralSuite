import { create } from 'zustand';
import { api } from './api';

export interface DashboardStats {
  revenue: {
    total: number;
    change: number;
  };
  patients: {
    total: number;
    change: number;
  };
  appointments: {
    total: number;
    change: number;
  };
  upcomingAppointments: Record<string, unknown>[];
  recentInsights: {
    type: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ data: DashboardStats }>('/dashboard/stats');
      set({ stats: res.data, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },
}));
