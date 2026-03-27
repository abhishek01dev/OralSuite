import { create } from 'zustand';
import { api } from './api';
import { useCartStore } from './cart-store';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    practiceName?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { token: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const tenantId = api.getTenantId();
    if (tenantId) api.setTenantId(tenantId);

    const res = await api.post<{
      success: boolean;
      data: {
        user: User;
        tokens: { accessToken: string; refreshToken: string };
      };
    }>('/auth/login', { email, password });

    sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
    sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken);

    if (res.data.user.tenantId) {
      api.setTenantId(res.data.user.tenantId);
    }

    const me = await api.get<{ data: User }>('/auth/me');
    set({ user: me.data, isAuthenticated: true, isLoading: false });

    // Merge guest cart after successful authentication
    await useCartStore.getState().mergeOnLogin();
  },

  register: async (data) => {
    const tenantId = api.getTenantId();
    if (tenantId) api.setTenantId(tenantId);

    const res = await api.post<{
      data: { user: User; tokens: { accessToken: string; refreshToken: string } };
    }>('/auth/register', data);

    sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
    sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken);
    if (res.data.user.tenantId) {
      api.setTenantId(res.data.user.tenantId);
    }

    const me = await api.get<{ data: User }>('/auth/me');
    set({ user: me.data, isAuthenticated: true, isLoading: false });

    await useCartStore.getState().mergeOnLogin();
  },

  logout: () => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    api.post('/auth/logout', { refreshToken }).catch(() => {});

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  fetchUser: async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      useCartStore.getState().loadCart();
      set({ isLoading: false });
      return;
    }

    api.detectTenant();

    try {
      const me = await api.get<{ data: User }>('/auth/me');
      set({ user: me.data, isAuthenticated: true, isLoading: false });
      useCartStore.getState().loadCart();
    } catch {
      sessionStorage.removeItem('accessToken');
      useCartStore.getState().loadCart();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    const tenantId = api.getTenantId();
    if (tenantId) api.setTenantId(tenantId);
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data) => {
    const tenantId = api.getTenantId();
    if (tenantId) api.setTenantId(tenantId);
    await api.post('/auth/reset-password', data);
  },
}));
