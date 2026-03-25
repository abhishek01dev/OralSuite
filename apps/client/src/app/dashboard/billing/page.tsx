"use client";
import { useState, useEffect } from "react";
import { useBillingStore, Invoice } from "@/lib/billing-store";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  paid: 'bg-secondary/10 text-secondary',
  pending: 'bg-primary/10 text-primary',
  overdue: 'bg-error/10 text-error',
};

export default function ClientBillingPage() {
  const [filter, setFilter] = useState('All');
  const { invoices, fetchInvoices, isLoading } = useBillingStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered = invoices.filter(i => filter === 'All' || i.status === filter.toLowerCase());

  const kpis = {
    revenue: invoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? inv.totalAmount : 0), 0),
    pending: invoices.reduce((acc, inv) => acc + (inv.status === 'pending' ? inv.totalAmount : 0), 0),
    overdue: invoices.reduce((acc, inv) => acc + (inv.status === 'overdue' ? inv.totalAmount : 0), 0),
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Billing & Invoices</h2>
          <p className="text-on-surface-variant mt-1">Track payments and generate invoices for your practice.</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          Generate Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Revenue This Month', value: formatCurrency(kpis.revenue), change: '+12%', icon: 'payments', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Pending', value: formatCurrency(kpis.pending), icon: 'pending_actions', bg: 'bg-tertiary/10', color: 'text-tertiary' },
          { label: 'Overdue', value: formatCurrency(kpis.overdue), icon: 'warning', bg: 'bg-error/10', color: 'text-error' },
        ].map(k => (
          <div key={k.label} className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-125"></div>
            <div className={`w-10 h-10 ${k.bg} ${k.color} rounded-xl flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined">{k.icon}</span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{k.label}</p>
            <h3 className="text-3xl font-extrabold font-headline text-on-surface">{k.value}</h3>
            {k.change && <span className="text-secondary text-xs font-bold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-xs">trending_up</span>{k.change} vs last month</span>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse">
            <span className="text-on-surface-variant font-bold">Fetching transaction records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center italic text-on-surface-variant">
            No invoices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  {['Invoice ID', 'Patient', 'Amount', 'Due Date', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-primary">#{inv.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {inv.patient?.firstName?.[0]}{inv.patient?.lastName?.[0]}
                        </div>
                        <span className="text-sm font-semibold text-on-surface">{inv.patient?.firstName} {inv.patient?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
