import { create } from 'zustand';
import { api } from './api';

export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  startTime: string;
  endTime: string;
  status: string;
  treatmentType?: string;
  notes?: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
  dentist?: {
    firstName: string;
    lastName: string;
  };
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: (params?: Record<string, string>) => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<{ data: Appointment[] }>('/appointments', params);
      set({ appointments: res.data, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch appointments',
        isLoading: false,
      });
    }
  },

  createAppointment: async (data: Partial<Appointment>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<{ data: Appointment }>('/appointments', data);
      set((state) => ({
        appointments: [...state.appointments, res.data].sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ),
        isLoading: false,
      }));
      return res.data;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to create appointment',
        isLoading: false,
      });
      throw err;
    }
  },

  updateAppointment: async (id: string, data: Partial<Appointment>) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.patch<{ data: Appointment }>(`/appointments/${id}`, data);
      set((state) => ({
        appointments: state.appointments.map((a) => (a.id === id ? res.data : a)),
        isLoading: false,
      }));
      return res.data;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update appointment',
        isLoading: false,
      });
      throw err;
    }
  },

  deleteAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/appointments/${id}`);
      set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to delete appointment',
        isLoading: false,
      });
      throw err;
    }
  },
}));
