"use client";
import { useState, useEffect } from "react";
import { useAppointmentsStore, Appointment } from "@/lib/appointments-store";

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const statusGroup = ['completed', 'confirmed', 'scheduled', 'cancelled'];
const statusStyle: Record<string, string> = {
  completed: 'bg-secondary/10 text-secondary',
  'in-progress': 'bg-primary/10 text-primary',
  confirmed: 'bg-tertiary/10 text-tertiary',
  scheduled: 'bg-surface-container-highest text-on-surface-variant',
  cancelled: 'bg-error/10 text-error',
};

export default function ClientAppointmentsPage() {
  const [view, setView] = useState<'list' | 'timeline'>('timeline');
  const [statusFilter, setStatusFilter] = useState('All');
  const { appointments, fetchAppointments, isLoading } = useAppointmentsStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filtered = appointments.filter(a => statusFilter === 'All' || a.status === statusFilter);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Appointments</h2>
          <p className="text-on-surface-variant mt-1">Today's schedule — Thursday, March 20, 2024</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Book Appointment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Today', value: appointments.length.toString(), icon: 'calendar_month' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length.toString(), icon: 'check_circle', color: 'text-secondary' },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length.toString(), icon: 'event_available', color: 'text-tertiary' },
          { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length.toString(), icon: 'schedule', color: 'text-primary' },
          { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length.toString(), icon: 'cancel', color: 'text-error' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-sm text-center">
            <p className="text-2xl font-extrabold font-headline text-on-surface">{s.value}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View / Filter Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {['All', ...statusGroup].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-lg gap-0.5">
          <button onClick={() => setView('timeline')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'timeline' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>Timeline</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>List</button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-surface-container-lowest rounded-[2rem] p-20 text-center animate-pulse">
          <span className="text-on-surface-variant font-headline font-bold">Synchronizing your schedule...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-[2rem] p-20 text-center italic text-on-surface-variant">
          No appointments found.
        </div>
      ) : view === 'timeline' ? (
        /* Timeline View */
        <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm overflow-hidden">
          <div className="flex gap-4">
            {/* Time axis */}
            <div className="w-16 shrink-0 space-y-0">
              {hours.map(h => (
                <div key={h} className="h-16 flex items-start pt-2">
                  <span className="text-[11px] font-bold text-on-surface-variant">{h}</span>
                </div>
              ))}
            </div>
            {/* Slots */}
            <div className="flex-1 relative border-l border-outline-variant/10">
              {hours.map(h => (
                <div key={h} className="h-16 border-t border-outline-variant/10"></div>
              ))}
              {filtered.map((apt, i) => {
                const startTime = new Date(apt.startTime);
                const startHour = startTime.getHours() + (startTime.getMinutes() / 60);
                const startOffset = Math.max(0, startHour - 8);
                
                const endTime = new Date(apt.endTime);
                const endHour = endTime.getHours() + (endTime.getMinutes() / 60);
                const duration = Math.max(0.5, endHour - startHour);

                const topPx = startOffset * 64;
                const heightPx = Math.max(32, duration * 64 - 4);

                return (
                  <div
                    key={apt.id}
                    className={`absolute left-2 right-2 rounded-xl p-3 border-l-4 cursor-pointer hover:shadow-md transition-all bg-surface-container-low border-primary/20 text-primary`}
                    style={{ top: `${topPx}px`, height: `${heightPx}px` }}
                  >
                    <p className="text-xs font-bold truncate">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                    <p className="text-[11px] opacity-80 truncate">{apt.treatmentType || 'Dental Consultation'}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[apt.status]}`}>{apt.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  {['Time', 'Patient', 'Treatment', 'Dentist', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">
                      {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-on-surface">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{apt.treatmentType || 'General'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">Dr. {apt.dentist?.lastName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle[apt.status]}`}>
                        {apt.status}
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
        </div>
      )}
    </div>
  );
}
