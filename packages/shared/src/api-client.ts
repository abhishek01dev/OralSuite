/// <reference lib="dom" />

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Shared HTTP client used by frontend apps (admin + client).
 * Handles token injection, tenant headers, and standardised error handling.
 */
export class ApiClient {
  private baseUrl: string;
  private tenantId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Extracts tenant slug from the current hostname's subdomain. */
  detectTenant() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('tenantId');
    if (stored) {
      this.tenantId = stored;
      return;
    }

    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      const slug = parts[0]!;
      this.tenantId = slug;
      localStorage.setItem('tenantId', slug);
    }
  }

  setTenantId(id: string) {
    this.tenantId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenantId', id);
    }
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(this.tenantId ? { 'x-tenant-id': this.tenantId } : {}),
      ...((options.headers as Record<string, string>) ?? {}),
    };

    const response = await fetch(url, { ...fetchOptions, headers });
    const data = (await response.json()) as { error?: { message?: string; code?: string } };

    if (!response.ok) {
      throw new ApiError(
        data.error?.message ?? 'Request failed',
        response.status,
        data.error?.code,
      );
    }

    return data as T;
  }

  get<T>(endpoint: string, params?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}
