'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@repo/shared';

interface DemoRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  description: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export default function DemoRequestsPage() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const client = new ApiClient('/api/v1');

      const url = filter === 'all' ? '/demo-requests' : `/demo-requests?status=${filter}`;
      const res = await client.get<{ data: { items: DemoRequest[] } }>(url);
      setRequests(res.data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch demo requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      const client = new ApiClient('/api/v1');

      await client.patch(`/demo-requests/${id}`, { status: newStatus });

      // Optimistic update
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-3 py-1 bg-error-container text-on-error-container text-xs font-bold uppercase tracking-wider rounded-full">
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider rounded-full">
            Contacted
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold uppercase tracking-wider rounded-full">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-surface-container-high text-xs font-bold uppercase tracking-wider rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface">Demo Requests</h1>
          <p className="text-on-surface-variant mt-1">
            Manage incoming leads from the landing page
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-xl w-fit border border-outline-variant/10">
        {(['all', 'new', 'contacted', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
              filter === f
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error ? (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl">{error}</div>
      ) : loading ? (
        <div className="flex justify-center p-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center p-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">
            inbox
          </span>
          <h3 className="text-xl font-bold font-headline mb-2">No Requests Found</h3>
          <p className="text-on-surface-variant">
            There are no demo requests matching the current filter.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  <th className="p-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">
                    Date
                  </th>
                  <th className="p-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">
                    Prospect
                  </th>
                  <th className="p-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">
                    Details
                  </th>
                  <th className="p-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-surface-container-lowest/50 transition-colors group"
                  >
                    <td className="p-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{req.name}</p>
                      <p className="text-sm text-on-surface-variant mt-0.5 whitespace-nowrap">
                        {req.email}
                      </p>
                      {req.phone && (
                        <p className="text-xs text-on-surface-variant mt-0.5">{req.phone}</p>
                      )}
                    </td>
                    <td className="p-4 min-w-[300px] max-w-md">
                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {req.description}
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <select
                        className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                        value={req.status}
                        onChange={(e) =>
                          updateStatus(req.id, e.target.value as 'new' | 'contacted' | 'closed')
                        }
                      >
                        <option value="new">Mark as New</option>
                        <option value="contacted">Mark as Contacted</option>
                        <option value="closed">Mark as Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
