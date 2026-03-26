'use client';
import { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [40, 45, 55, 50, 65, 75, 70, 85, 80, 90, 95, 100];
const appointmentsData = [60, 55, 70, 65, 72, 80, 76, 88, 84, 90, 95, 92];

export default function ReportsPage() {
  const [tab, setTab] = useState<'revenue' | 'appointments' | 'retention'>('revenue');
  const [period, setPeriod] = useState('12M');

  const data = tab === 'revenue' ? revenueData : appointmentsData;
  const maxVal = Math.max(...data);

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Reports & Analytics
          </h2>
          <p className="text-on-surface-variant">
            Comprehensive platform performance and business intelligence.
          </p>
        </div>
        <button className="bg-surface-container-lowest text-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-lg">file_download</span>
          Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: '$1.72M', change: '+18.4%', icon: 'payments', up: true },
          {
            label: 'Active Tenants',
            value: '1,284',
            change: '+48 this month',
            icon: 'corporate_fare',
            up: true,
          },
          {
            label: 'Avg. Churn Rate',
            value: '2.1%',
            change: '-0.4%',
            icon: 'trending_down',
            up: true,
          },
          { label: 'NPS Score', value: '78', change: '+5 pts', icon: 'thumb_up', up: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              <span className="text-secondary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                {kpi.change}
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
              {kpi.label}
            </p>
            <h3 className="text-2xl font-extrabold font-manrope text-on-surface">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-xl font-bold font-manrope text-on-surface">Performance Trends</h4>
            <p className="text-sm text-on-surface-variant">Platform-wide metrics over time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-container-low p-1 rounded-lg gap-0.5">
              {(['revenue', 'appointments', 'retention'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-lg gap-0.5">
              {['3M', '6M', '12M'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-3 px-2 mb-4">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className={`w-full rounded-t-lg transition-all duration-300 relative ${
                  i >= data.length - 3
                    ? 'bg-primary hover:bg-primary/80'
                    : 'bg-surface-container-high hover:bg-primary/30'
                }`}
                style={{ height: `${(val / maxVal) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  {tab === 'revenue' ? `$${(val * 14200).toLocaleString()}` : val}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter px-2">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tenants */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <h4 className="text-xl font-bold font-manrope text-on-surface mb-6">
            Top Performing Tenants
          </h4>
          <div className="space-y-4">
            {[
              {
                name: 'North Peak Dental',
                revenue: '$24,800',
                growth: '+22%',
                color: 'bg-primary',
              },
              {
                name: 'Metropolitan Dental',
                revenue: '$18,300',
                growth: '+15%',
                color: 'bg-secondary',
              },
              {
                name: 'Smile Center Austin',
                revenue: '$14,200',
                growth: '+18%',
                color: 'bg-tertiary',
              },
            ].map((tenant, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-bold text-on-surface-variant w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-on-surface">{tenant.name}</span>
                    <span className="text-sm font-bold text-on-surface">{tenant.revenue}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`${tenant.color} h-full rounded-full`}
                      style={{ width: `${90 - i * 20}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">{tenant.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution Donut */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
          <h4 className="text-xl font-bold font-manrope text-on-surface mb-6">Revenue by Plan</h4>
          <div className="flex items-center gap-8">
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="100, 100"
                  strokeWidth="3"
                ></path>
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="62, 100"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="25, 100"
                  strokeWidth="4"
                  strokeDashoffset="-62"
                ></path>
                <path
                  className="text-tertiary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="13, 100"
                  strokeWidth="4"
                  strokeDashoffset="-87"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-manrope">1.2k</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Tenants
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: 'Enterprise', pct: '62%', color: 'bg-primary' },
                { label: 'Pro', pct: '25%', color: 'bg-secondary' },
                { label: 'Basic', pct: '13%', color: 'bg-tertiary' },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${p.color}`}></span>
                    <span className="text-sm font-medium">{p.label}</span>
                  </div>
                  <span className="text-sm font-bold">{p.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
