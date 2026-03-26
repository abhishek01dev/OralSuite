import { create } from 'zustand';
import { api } from './api';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientsState {
  patients: Patient[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchPatients: (params?: any) => Promise<void>;
  createPatient: (data: any) => Promise<Patient>;
  updatePatient: (id: string, data: any) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientsStore = create<PatientsState>((set) => ({
  patients: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchPatients: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ data: Patient[]; meta: { total: number } }>('/patients', params);
      set({ patients: res.data, total: res.meta.total, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createPatient: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<{ data: Patient }>('/patients', data);
      set((state) => ({
        patients: [res.data, ...state.patients],
        total: state.total + 1,
        isLoading: false,
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updatePatient: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.patch<{ data: Patient }>(`/patients/${id}`, data);
      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? res.data : p)),
        isLoading: false,
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deletePatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/patients/${id}`);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
        total: state.total - 1,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
