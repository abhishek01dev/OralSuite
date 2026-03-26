'use client';
import { useState } from 'react';

const invoices = [
  {
    id: 'INV-2401',
    clinic: 'North Peak Dental',
    initials: 'NP',
    amount: '$4,580',
    issued: 'Mar 1, 2024',
    due: 'Mar 15, 2024',
    plan: 'Enterprise',
    status: 'Paid',
  },
  {
    id: 'INV-2402',
    clinic: 'Ocean Breeze Ortho',
    initials: 'OB',
    amount: '$1,200',
    issued: 'Mar 3, 2024',
    due: 'Mar 17, 2024',
    plan: 'Basic',
    status: 'Pending',
  },
  {
    id: 'INV-2403',
    clinic: 'Smile Center Austin',
    initials: 'SC',
    amount: '$2,800',
    issued: 'Feb 15, 2024',
    due: 'Mar 1, 2024',
    plan: 'Pro',
    status: 'Overdue',
  },
  {
    id: 'INV-2404',
    clinic: 'Lakeside Vista Clinic',
    initials: 'LV',
    amount: '$2,800',
    issued: 'Mar 5, 2024',
    due: 'Mar 19, 2024',
    plan: 'Pro',
    status: 'Paid',
  },
  {
    id: 'INV-2405',
    clinic: 'Pure Dental Hub',
    initials: 'PD',
    amount: '$4,580',
    issued: 'Mar 7, 2024',
    due: 'Mar 21, 2024',
    plan: 'Enterprise',
    status: 'Pending',
  },
  {
    id: 'INV-2406',
    clinic: 'Metropolitan Dental',
    initials: 'MD',
    amount: '$4,580',
    issued: 'Feb 10, 2024',
    due: 'Feb 24, 2024',
    plan: 'Enterprise',
    status: 'Overdue',
  },
];

const statusStyle: Record<string, string> = {
  Paid: 'bg-secondary/10 text-secondary',
  Pending: 'bg-primary/10 text-primary',
  Overdue: 'bg-error/10 text-error',
};

export default function BillingPage() {
  const [filter, setFilter] = useState('All');

  const filtered = invoices.filter((inv) => filter === 'All' || inv.status === filter);
  const totalRevenue = 142500;
  const outstanding = 18200;
  const overdue = 9360;

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Billing & Invoices
          </h2>
          <p className="text-on-surface-variant">
            Manage subscription billing and invoice status across all tenants.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          Generate Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>+12.4%
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
            Monthly Revenue
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">
            ${totalRevenue.toLocaleString()}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-tertiary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
            Outstanding
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">
            ${outstanding.toLocaleString()}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-error/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
            Overdue
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-error">
            ${overdue.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['All', 'Paid', 'Pending', 'Overdue'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Invoice', 'Clinic', 'Plan', 'Amount', 'Issued', 'Due Date', 'Status', ''].map(
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
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-primary">{inv.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {inv.initials}
                      </div>
                      <p className="text-sm font-semibold text-on-surface">{inv.clinic}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                      {inv.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{inv.amount}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{inv.issued}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{inv.due}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
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
            Showing {filtered.length} of {invoices.length} invoices
          </span>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Export All
            <span className="material-symbols-outlined text-lg">file_download</span>
          </button>
        </div>
      </section>
    </>
  );
}
