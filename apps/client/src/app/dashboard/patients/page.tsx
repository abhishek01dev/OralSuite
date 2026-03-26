'use client';
import { useState, useEffect } from 'react';
import { usePatientsStore } from '@/lib/patients-store';

const statusStyles: Record<string, string> = {
  Active: 'bg-secondary/10 text-secondary',
  Scheduled: 'bg-primary/10 text-primary',
  Overdue: 'bg-error/10 text-error',
};

export default function ClientPatientsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const { patients, fetchPatients, isLoading } = usePatientsStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filtered = patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.id).length, // Simplified for now
    scheduled: 0,
    overdue: 0,
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            Patients
          </h2>
          <p className="text-on-surface-variant mt-1">
            Manage and review your active patient list.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          New Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Patients',
            value: stats.total.toLocaleString(),
            icon: 'people',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Active',
            value: stats.active.toLocaleString(),
            icon: 'check_circle',
            color: 'text-secondary',
            bg: 'bg-secondary/10',
          },
          {
            label: 'Scheduled',
            value: stats.scheduled.toLocaleString(),
            icon: 'event',
            color: 'text-tertiary',
            bg: 'bg-tertiary/10',
          },
          {
            label: 'Overdue',
            value: stats.overdue.toLocaleString(),
            icon: 'warning',
            color: 'text-error',
            bg: 'bg-error/10',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}
            >
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-2xl font-bold font-headline">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
            placeholder="Search patients by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm outline-none font-semibold text-on-surface"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm animate-pulse h-48"
            ></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant italic bg-surface-container-lowest rounded-[2rem]">
            No patients found matching your search.
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary/10 text-primary`}
                  >
                    {p.firstName[0]}
                    {p.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {p.email} · {p.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyles['Active']}`}
                >
                  Active
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Last Visit</span>
                  <span className="font-semibold text-on-surface">2 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Next Appt</span>
                  <span className={`font-semibold text-primary`}>Mar 30, 2024</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-surface-container-low text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  View Chart
                </button>
                <button className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">event</span>
                  Book
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
