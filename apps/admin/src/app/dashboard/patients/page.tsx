'use client';
import { useState } from 'react';

const patients = [
  {
    id: 'P-1001',
    initials: 'SA',
    name: 'Sarah Avery',
    dob: 'Mar 12, 1985',
    clinic: 'North Peak Dental',
    lastVisit: '2 days ago',
    plan: 'Enterprise',
    status: 'Active',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'P-1002',
    initials: 'RK',
    name: 'Robert Kagawa',
    dob: 'Jul 5, 1972',
    clinic: 'Ocean Breeze Ortho',
    lastVisit: '1 week ago',
    plan: 'Pro',
    status: 'Active',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'P-1003',
    initials: 'EL',
    name: 'Elena Lopez',
    dob: 'Nov 22, 1990',
    clinic: 'Lakeside Vista Clinic',
    lastVisit: '3 weeks ago',
    plan: 'Basic',
    status: 'Trialing',
    color: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'P-1004',
    initials: 'DA',
    name: 'David Anderson',
    dob: 'Jan 8, 1965',
    clinic: 'North Peak Dental',
    lastVisit: '1 month ago',
    plan: 'Enterprise',
    status: 'Past Due',
    color: 'bg-error/10 text-error',
  },
  {
    id: 'P-1005',
    initials: 'ML',
    name: 'Maria Lindqvist',
    dob: 'Sep 17, 1998',
    clinic: 'Smile Center Austin',
    lastVisit: '5 days ago',
    plan: 'Pro',
    status: 'Active',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'P-1006',
    initials: 'JT',
    name: 'James Thornton',
    dob: 'Apr 3, 1980',
    clinic: 'Ocean Breeze Ortho',
    lastVisit: '2 weeks ago',
    plan: 'Basic',
    status: 'Active',
    color: 'bg-secondary/10 text-secondary',
  },
];

const statusColor: Record<string, string> = {
  Active: 'bg-secondary/10 text-secondary',
  Trialing: 'bg-primary/10 text-primary',
  'Past Due': 'bg-error/10 text-error',
};

export default function PatientManagementPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = patients.filter(
    (p) =>
      (statusFilter === 'All' || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.clinic.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Patient Management
          </h2>
          <p className="text-on-surface-variant max-w-xl">
            View and manage patients across all tenant clinics.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
            placeholder="Search patients or clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['All', 'Active', 'Trialing', 'Past Due'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Patient', 'Date of Birth', 'Clinic', 'Last Visit', 'Plan', 'Status', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-surface-container-low/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${p.color}`}
                      >
                        {p.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{p.name}</p>
                        <p className="text-xs text-on-surface-variant">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">{p.dob}</td>
                  <td className="px-6 py-4 text-sm text-on-surface">{p.clinic}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                      {p.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low/20 flex justify-between items-center text-sm">
          <span className="text-on-surface-variant font-medium">
            Showing {filtered.length} of {patients.length} patients
          </span>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Patients
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>
    </>
  );
}
