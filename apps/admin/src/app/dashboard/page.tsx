'use client';

export default function DashboardPage() {
  return (
    <>
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Platform Pulse
          </h2>
          <p className="text-on-surface-variant max-w-xl">
            Overview of DentFlow's network performance, revenue growth, and operational health.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest text-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Financial Report
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Tenant
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +12.4%
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
            Monthly Recurring Revenue
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">$142,500</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">add</span>
              48
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
            Total Active Clinics
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">1,284</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-error text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_down</span>
              -0.8%
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
            Daily Active Users
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">8,912</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/20 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +4.2%
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">
            Avg. Revenue Per Tenant
          </p>
          <h3 className="text-3xl font-extrabold font-manrope text-on-surface">$110.98</h3>
        </div>
      </section>

      {/* Main Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Analytics Chart Area */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold font-manrope text-on-surface">
                Subscription Revenue Growth
              </h4>
              <p className="text-sm text-on-surface-variant">
                Last 12 months performance trajectory
              </p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded-md shadow-sm">
                Revenue
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                Churn
              </button>
            </div>
          </div>
          {/* Mock Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            <div className="w-full bg-surface-container-high rounded-t-lg h-[40%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-2 py-1 rounded">
                Jan
              </div>
            </div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[45%]"></div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[55%]"></div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[50%]"></div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[65%]"></div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[75%]"></div>
            <div className="w-full bg-surface-container-high rounded-t-lg h-[70%]"></div>
            <div className="w-full bg-primary/20 rounded-t-lg h-[85%] border-t-4 border-primary"></div>
            <div className="w-full bg-primary/20 rounded-t-lg h-[80%] border-t-4 border-primary"></div>
            <div className="w-full bg-primary/20 rounded-t-lg h-[90%] border-t-4 border-primary"></div>
            <div className="w-full bg-primary/20 rounded-t-lg h-[95%] border-t-4 border-primary"></div>
            <div className="w-full bg-primary rounded-t-lg h-[100%]"></div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl h-full flex flex-col">
            <h4 className="text-xl font-bold font-manrope text-on-surface mb-6">
              Plan Distribution
            </h4>
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative w-40 h-40 mx-auto mb-8">
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
                    strokeDasharray="75, 100"
                    strokeWidth="4"
                  ></path>
                  <path
                    className="text-tertiary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="35, 100"
                    strokeWidth="4"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-manrope">1.2k</span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    Total
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-sm font-medium">Enterprise</span>
                  </div>
                  <span className="text-sm font-bold">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                    <span className="text-sm font-medium">Pro Plan</span>
                  </div>
                  <span className="text-sm font-bold">38%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                    <span className="text-sm font-medium">Basic</span>
                  </div>
                  <span className="text-sm font-bold">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Support Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-secondary">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold font-manrope text-on-surface">
              Infrastructure Health
            </h4>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              All Systems Nominal
            </span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-surface-container-low rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                API Latency
              </p>
              <p className="text-2xl font-bold font-manrope text-on-surface">24ms</p>
              <div className="mt-3 flex gap-0.5">
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary/30 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                Server Uptime
              </p>
              <p className="text-2xl font-bold font-manrope text-on-surface">99.98%</p>
              <div className="mt-3 flex gap-0.5">
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                DB Connections
              </p>
              <p className="text-2xl font-bold font-manrope text-on-surface">1.2k</p>
              <div className="mt-3 flex gap-0.5">
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-secondary rounded-full"></div>
                <div className="h-1 w-full bg-tertiary-fixed-dim rounded-full"></div>
                <div className="h-1 w-full bg-tertiary-fixed-dim/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-surface-container-high py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-lg">terminal</span>
              Open Console
            </button>
            <button className="flex-1 bg-primary/10 text-primary py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-lg">campaign</span>
              Broadcast Message
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold font-manrope text-on-surface">Critical Tickets</h4>
            <a className="text-primary text-xs font-bold hover:underline" href="#">
              View All Tickets
            </a>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-error-container/20 rounded-xl group cursor-pointer hover:bg-error-container/30 transition-all">
              <div className="w-10 h-10 bg-error-container text-error rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">SSO Authentication Failure</p>
                <p className="text-xs text-on-surface-variant">
                  Metropolitan Dental Group • 14m ago
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-error transition-colors">
                chevron_right
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 bg-surface-variant text-primary rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Bulk X-Ray Import Delay</p>
                <p className="text-xs text-on-surface-variant">Smile Center Austin • 2h ago</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 bg-surface-variant text-primary rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Billing Cycle Discrepancy</p>
                <p className="text-xs text-on-surface-variant">Pure Dental Clinic • 5h ago</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
          <h4 className="text-xl font-bold font-manrope text-on-surface">
            Recent Signups &amp; Tenant Status
          </h4>
          <div className="flex gap-4">
            <select className="bg-surface-container-low border-none rounded-lg text-xs font-bold py-2 px-4 outline-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Trialing</option>
              <option>Past Due</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Clinic Name
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Administrator
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Plan
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Health Score
                </th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary-container/20 flex items-center justify-center text-primary font-bold">
                      NP
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">North Peak Dental</p>
                      <p className="text-xs text-on-surface-variant">Joined 2 days ago</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">Dr. Sarah Jenkins</p>
                  <p className="text-xs text-on-surface-variant">sarah@northpeak.com</p>
                </td>
                <td className="px-8 py-5">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    Enterprise
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-xs font-semibold text-secondary">Active</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[95%]"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary font-bold">
                      OB
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Ocean Breeze Ortho</p>
                      <p className="text-xs text-on-surface-variant">Joined 4 days ago</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">Michael Chang</p>
                  <p className="text-xs text-on-surface-variant">m.chang@oceanbreeze.com</p>
                </td>
                <td className="px-8 py-5">
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                    Basic
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="text-xs font-semibold text-on-tertiary-fixed-variant">
                      Trialing
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary-fixed-dim h-full w-[60%]"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-error-container/20 flex items-center justify-center text-error font-bold">
                      LV
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Lakeside Vista Clinic</p>
                      <p className="text-xs text-on-surface-variant">Joined 1 month ago</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">Dr. Elena Rodriguez</p>
                  <p className="text-xs text-on-surface-variant">e.rod@lakesidevista.io</p>
                </td>
                <td className="px-8 py-5">
                  <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold">
                    Pro
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="text-xs font-semibold text-error">Past Due</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-error h-full w-[15%]"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low/20 text-center">
          <button className="text-primary font-bold text-sm flex items-center gap-2 mx-auto hover:gap-3 transition-all">
            View All 1,284 Tenants
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>
    </>
  );
}
