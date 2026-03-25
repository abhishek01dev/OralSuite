"use client";
import { useState } from "react";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [8200, 9100, 10500, 9800, 11800, 12400, 11200, 13800, 12900, 14200, 11900, 12450];
const aptData = [210, 228, 245, 232, 258, 272, 264, 290, 281, 305, 289, 312];
const maxRev = Math.max(...revenueData);
const maxApt = Math.max(...aptData);

export default function ClientReportsPage() {
  const [tab, setTab] = useState<'revenue' | 'appointments' | 'retention'>('revenue');

  const data = tab === 'revenue' ? revenueData : aptData;
  const maxVal = tab === 'revenue' ? maxRev : maxApt;

  const formatVal = (v: number) => tab === 'revenue' ? `$${(v/1000).toFixed(1)}k` : v.toString();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Reports & Analytics</h2>
          <p className="text-on-surface-variant mt-1">Practice performance overview for the past 12 months.</p>
        </div>
        <button className="bg-surface-container-lowest text-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-lg">file_download</span>
          Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Revenue YTD', value: '$12,450', change: '+15%', icon: 'payments', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'New Patients', value: '24', change: '+8%', icon: 'person_add', bg: 'bg-secondary/10', color: 'text-secondary' },
          { label: 'Avg. Appts/Day', value: '18', change: '+5%', icon: 'event', bg: 'bg-tertiary/10', color: 'text-tertiary' },
          { label: 'Retention Rate', value: '94%', change: '+2.1%', icon: 'loyalty', bg: 'bg-surface-container-high', color: 'text-on-surface' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-125"></div>
            <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined">{kpi.icon}</span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-extrabold font-headline text-on-surface">{kpi.value}</h3>
            <span className="text-secondary text-xs font-bold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>{kpi.change} vs last period
            </span>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-xl font-bold font-headline text-on-surface">12-Month Trends</h4>
            <p className="text-sm text-on-surface-variant">Practice-wide performance metrics over time</p>
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-xl gap-0.5">
            {(['revenue', 'appointments', 'retention'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 px-1 mb-4">
          {data.map((val, i) => (
            <div key={i} className="flex-1 group flex flex-col items-center gap-1">
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${i === new Date().getMonth() ? 'bg-primary' : i < new Date().getMonth() ? 'bg-primary/30' : 'bg-surface-container-high'}`}
                  style={{ height: `${(val / maxVal) * 192}px` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-surface text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    {formatVal(val)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Breakdown */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <h4 className="text-xl font-bold font-headline text-on-surface mb-6">Treatment Revenue Breakdown</h4>
          <div className="space-y-5">
            {[
              { label: 'Restorative', pct: 65, value: '$8,090', color: 'bg-primary' },
              { label: 'Preventative', pct: 20, value: '$2,490', color: 'bg-secondary' },
              { label: 'Cosmetic', pct: 10, value: '$1,245', color: 'bg-tertiary' },
              { label: 'Surgery', pct: 5, value: '$622', color: 'bg-outline-variant' },
            ].map(t => (
              <div key={t.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-on-surface">{t.label}</span>
                  <span className="font-bold text-on-surface">{t.value} <span className="text-on-surface-variant font-medium">({t.pct}%)</span></span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`${t.color} h-full rounded-full transition-all duration-500`} style={{ width: `${t.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Retention */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <h4 className="text-xl font-bold font-headline text-on-surface mb-6">Patient Retention</h4>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeWidth="4"></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-headline text-primary">94%</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">Retained</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { label: 'Returning Patients', value: '1,205', color: 'bg-primary' },
                { label: 'Lost Last Quarter', value: '72', color: 'bg-error' },
                { label: 'Reactivated', value: '38', color: 'bg-secondary' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${s.color} shrink-0`}></span>
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-on-surface-variant">{s.label}</span>
                    <span className="text-sm font-bold text-on-surface">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
