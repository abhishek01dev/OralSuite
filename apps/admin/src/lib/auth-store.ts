import { create } from 'zustand';
import { api } from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  roles: { role: { id: string; name: string; slug: string } }[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setTenant: (tenantId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password, tenantId) => {
    api.setTenantId(tenantId);
    const res = await api.post<{ data: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { email, password },
    );
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('tenantId', tenantId);

    const me = await api.get<{ data: User }>('/auth/me');
    set({ user: me.data, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  fetchUser: async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) {
      set({ isLoading: false });
      return;
    }
    api.setTenantId(tenantId);
    try {
      const me = await api.get<{ data: User }>('/auth/me');
      set({ user: me.data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setTenant: (tenantId) => {
    localStorage.setItem('tenantId', tenantId);
    api.setTenantId(tenantId);
  },
}));
