'use client';
import { useState } from 'react';

const appointments = [
  {
    id: 'APT-001',
    time: '09:00 AM',
    patient: 'Sarah Mitchell',
    patientInitials: 'SM',
    clinic: 'North Peak Dental',
    treatment: 'Routine Checkup & Cleaning',
    doctor: 'Dr. Vance',
    status: 'Completed',
  },
  {
    id: 'APT-002',
    time: '10:30 AM',
    patient: 'Robert Kagawa',
    patientInitials: 'RK',
    clinic: 'Ocean Breeze Ortho',
    treatment: 'Root Canal Therapy',
    doctor: 'Dr. Aris',
    status: 'Confirmed',
  },
  {
    id: 'APT-003',
    time: '11:45 AM',
    patient: 'Elena Lopez',
    patientInitials: 'EL',
    clinic: 'Smile Center Austin',
    treatment: 'Wisdom Tooth Extraction',
    doctor: 'Dr. Vance',
    status: 'In-Progress',
  },
  {
    id: 'APT-004',
    time: '01:15 PM',
    patient: 'David Anderson',
    patientInitials: 'DA',
    clinic: 'Lakeside Vista Clinic',
    treatment: 'Crown Placement',
    doctor: 'Dr. Patel',
    status: 'Scheduled',
  },
  {
    id: 'APT-005',
    time: '02:30 PM',
    patient: 'Maria Lindqvist',
    patientInitials: 'ML',
    clinic: 'North Peak Dental',
    treatment: 'Dental Implant Consultation',
    doctor: 'Dr. Vance',
    status: 'Confirmed',
  },
  {
    id: 'APT-006',
    time: '03:45 PM',
    patient: 'James Thornton',
    patientInitials: 'JT',
    clinic: 'Ocean Breeze Ortho',
    treatment: 'Orthodontic Review',
    doctor: 'Dr. Aris',
    status: 'Cancelled',
  },
];

const statusStyle: Record<string, string> = {
  Completed: 'bg-secondary/10 text-secondary',
  Confirmed: 'bg-primary/10 text-primary',
  'In-Progress': 'bg-tertiary/10 text-tertiary',
  Scheduled: 'bg-surface-container-highest text-on-surface-variant',
  Cancelled: 'bg-error/10 text-error',
};

export default function AppointmentSchedulingPage() {
  const [view, setView] = useState<'list' | 'day'>('list');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = appointments.filter((a) => statusFilter === 'All' || a.status === statusFilter);

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Appointment Scheduling
          </h2>
          <p className="text-on-surface-variant">
            Monitor and manage appointments across all tenant clinics.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          New Appointment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Today Total',
            value: '48',
            icon: 'calendar_month',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Completed',
            value: '22',
            icon: 'check_circle',
            color: 'text-secondary',
            bg: 'bg-secondary/10',
          },
          {
            label: 'In Progress',
            value: '8',
            icon: 'pending',
            color: 'text-tertiary',
            bg: 'bg-tertiary/10',
          },
          {
            label: 'Cancelled',
            value: '3',
            icon: 'cancel',
            color: 'text-error',
            bg: 'bg-error/10',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}
            >
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-extrabold font-manrope text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {['All', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-lg gap-1">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'day' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Timeline
          </button>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Patient', 'Clinic', 'Time', 'Treatment', 'Doctor', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {a.patientInitials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{a.patient}</p>
                        <p className="text-xs text-on-surface-variant">{a.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">{a.clinic}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">{a.time}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{a.treatment}</td>
                  <td className="px-6 py-4 text-sm text-on-surface">{a.doctor}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[a.status]}`}
                    >
                      {a.status}
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
            Showing {filtered.length} appointments
          </span>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View Full Schedule
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>
    </>
  );
}
