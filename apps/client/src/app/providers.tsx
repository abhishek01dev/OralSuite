'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    api.detectTenant();
    fetchUser();
  }, [fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
