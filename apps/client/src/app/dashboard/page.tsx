"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useAuthStore } from "@/lib/auth-store";
import { formatCurrency } from "@/lib/utils";

export default function DentistDashboard() {
  const { user } = useAuthStore();
  const { stats, fetchStats, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statsList = stats || {
    revenue: { total: 0, change: 0 },
    patients: { total: 0, change: 0 },
    appointments: { total: 0, change: 0 },
    upcomingAppointments: [],
    recentInsights: []
  };

  const dashboardMetrics = [
    { label: "Revenue This Month", value: formatCurrency(statsList.revenue.total), change: statsList.revenue.change, icon: "payments", color: "bg-secondary-container/30", text: "text-on-secondary-container" },
    { label: "New Patients", value: statsList.patients.total.toString(), change: statsList.patients.change, icon: "person_add", color: "bg-tertiary-fixed/30", text: "text-on-tertiary-fixed-variant" },
    { label: "Appointments Today", value: statsList.appointments.total.toString(), change: statsList.appointments.change, icon: "event_note", color: "bg-primary-fixed/30", text: "text-on-primary-fixed-variant" }
  ];

  return (
    <div className="p-8 space-y-8 pb-24">
      {/* Welcome & Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Practice Overview</h2>
          <p className="text-on-surface-variant font-body mt-1">
            Good morning, Dr. {user?.lastName || 'Vance'}. Here is what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm text-sm font-semibold text-primary hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add Patient
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm text-sm font-semibold text-primary hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-[18px]">event</span>
            Book Appointment
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* AI Insights Card (Bento Large) */}
        <div className="col-span-12 lg:col-span-8 p-8 rounded-[2rem] bg-gradient-to-br from-primary/5 to-tertiary-container/5 border border-tertiary-fixed-dim/20 backdrop-blur-xl flex items-center gap-8 relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-tertiary-fixed-dim/10 rounded-full blur-3xl group-hover:bg-tertiary-fixed-dim/20 transition-all duration-700"></div>
          <div className="z-10 bg-primary w-20 h-20 rounded-3xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/30 shrink-0">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary text-[10px] font-bold tracking-widest uppercase">Smart Insights</span>
              <span className="text-xs text-on-surface-variant font-medium">Updated 2m ago</span>
            </div>
            <h3 className="text-2xl font-bold font-headline mb-4">You have <span className="text-primary">3 High-Priority</span> Follow-ups needing attention.</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
                <p className="text-sm font-body font-medium">Projected Revenue: <span className="text-secondary">+15% this month</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">clinical_notes</span>
                <p className="text-sm font-body font-medium">Patient retention is at <span className="text-blue-600">94%</span></p>
              </div>
            </div>
          </div>
          <button className="z-10 px-6 py-3 bg-on-surface text-surface rounded-2xl text-sm font-bold hover:bg-slate-800 transition-colors shrink-0">
            Review Now
          </button>
        </div>

        {/* Metrics Column */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
          {dashboardMetrics.map((metric, i) => (
            <div key={i} className={`p-6 rounded-[1.5rem] bg-surface-container-lowest shadow-sm flex items-center justify-between group hover:shadow-md transition-all ${isLoading ? 'animate-pulse' : ''}`}>
              <div>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">{metric.label}</p>
                <p className="text-2xl font-bold font-headline">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${metric.color} flex items-center justify-center ${metric.text} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{metric.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Appointments Table */}
        <div className="col-span-12 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline">Today's Appointments</h3>
              <p className="text-sm text-on-surface-variant font-body">Manage and monitor daily clinical workflow.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-on-surface-variant uppercase text-[11px] font-bold tracking-widest border-b border-outline-variant/10">
                  <th className="pb-4 pl-4">Patient Name</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4">Treatment</th>
                  <th className="pb-4">Doctor</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {statsList.upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-on-surface-variant italic">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  statsList.upcomingAppointments.map((appt: any) => (
                    <tr key={appt.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="py-5 pl-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed font-bold flex items-center justify-center text-xs">
                          {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                        </div>
                        <span className="font-semibold text-on-surface">{appt.patient?.firstName} {appt.patient?.lastName}</span>
                      </td>
                      <td className="py-5 font-medium text-on-surface">
                        {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-5 text-on-surface-variant">{appt.treatmentType || 'General Consultation'}</td>
                      <td className="py-5 flex items-center gap-2">
                        <img alt="Dentist" className="w-6 h-6 rounded-full" src={appt.dentist?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAV330r5MAkERTN_ketv4eYXoe_XgK6TpLhx_ivm9nm2uq2CIUtheuXlB_J-g5ru7F1GjL4QuPttJgIdyqU0fFPhtHXjhCXLrZ5A2gvVZl0fM4zUFHxiFktYZJysOcSlC4TCqy60Hhiezt6Q7eHNM5W8H6iBUgDEtoseLYEW9HYVF7HaaNbafNJFWNY4dtPDWIhEPiEKwNJH4XoedbwWALa2nnagTBdgZ1bdcI7Wg-Xx0eDPl5ziEeOxpj_1YcoQTAsX7BdEHlGvv4a"} />
                        <span className="text-on-surface">Dr. {appt.dentist?.lastName}</span>
                      </td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' :
                            appt.status === 'confirmed' ? 'bg-primary-fixed-dim text-on-primary-fixed-variant' :
                              'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-5 pr-4 text-right">
                        <button className="text-primary hover:underline font-semibold">View Chart</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Treatment Timeline (Sidebar Style) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold font-headline mb-6">Clinic Timeline</h3>
          <div className="space-y-8 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant/30"></div>
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary z-10">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">08:00 AM</p>
              <h4 className="text-sm font-bold text-on-surface">Staff Briefing Completed</h4>
              <p className="text-xs text-on-surface-variant">Daily goals and emergency protocols reviewed.</p>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-fixed-dim border-2 border-white flex items-center justify-center text-primary z-10">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">09:30 AM</p>
              <h4 className="text-sm font-bold text-on-surface">Lab Shipment Arriving</h4>
              <p className="text-xs text-on-surface-variant">Expecting crowns for Case #8210 and #8211.</p>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-tertiary-fixed-dim border-2 border-white flex items-center justify-center text-tertiary z-10">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">02:00 PM</p>
              <h4 className="text-sm font-bold text-on-surface">Inventory Audit</h4>
              <p className="text-xs text-on-surface-variant">Monthly stock check of anesthetics and resins.</p>
            </div>
          </div>
        </div>

        {/* Patient Demographics Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm overflow-hidden relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-headline">Practice Demographics</h3>
            <span className="text-xs text-on-surface-variant font-medium">Last 30 Days</span>
          </div>
          <div className="flex items-center gap-12">
            <div className="w-48 h-48 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#f0f3ff" strokeWidth="24"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#0052cc" strokeDasharray="502" strokeDashoffset="120" strokeWidth="24"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#006c47" strokeDasharray="502" strokeDashoffset="400" strokeWidth="24"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-extrabold font-headline">1.2k</p>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Active</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-on-surface">Restorative</span>
                      <span className="text-xs text-on-surface-variant">65%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[65%] h-full bg-primary"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-on-surface">Preventative</span>
                      <span className="text-xs text-on-surface-variant">20%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-secondary"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-on-surface">Cosmetic</span>
                      <span className="text-xs text-on-surface-variant">10%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-tertiary-fixed-dim"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-on-surface">Other</span>
                      <span className="text-xs text-on-surface-variant">5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="w-[5%] h-full bg-outline-variant"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <footer className="pt-8 flex justify-between items-center text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border-t border-slate-100 dark:border-slate-800/50">
        <div>© 2024 DentFlow Technologies. All Systems Operational.</div>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">System Status</a>
          <a className="hover:text-primary transition-colors" href="#">v2.4.1-Stable</a>
        </div>
      </footer>
    </div>
  );
}
