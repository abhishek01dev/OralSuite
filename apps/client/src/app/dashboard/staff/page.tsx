'use client';
import { useState } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const staff = [
  {
    id: 'S1',
    name: 'Dr. Julian Vance',
    initials: 'JV',
    role: 'Chief Surgeon',
    color: 'bg-primary/10 text-primary',
    schedule: [true, true, true, true, true, false],
  },
  {
    id: 'S2',
    name: 'Dr. Priya Aris',
    initials: 'PA',
    role: 'Endodontist',
    color: 'bg-secondary/10 text-secondary',
    schedule: [true, false, true, true, true, false],
  },
  {
    id: 'S3',
    name: 'Maya Chen',
    initials: 'MC',
    role: 'Hygienist',
    color: 'bg-tertiary/10 text-tertiary',
    schedule: [true, true, true, false, true, true],
  },
  {
    id: 'S4',
    name: "Kevin O'Brien",
    initials: 'KO',
    role: 'Clinic Manager',
    color: 'bg-surface-container-highest text-on-surface-variant',
    schedule: [false, false, false, false, false, false],
  },
  {
    id: 'S5',
    name: 'Aisha Patel',
    initials: 'AP',
    role: 'Billing Specialist',
    color: 'bg-primary/10 text-primary',
    schedule: [true, true, true, true, true, false],
  },
];

const leaveRequests = [
  {
    name: "Kevin O'Brien",
    from: 'Mar 18',
    to: 'Mar 24',
    reason: 'Annual Leave',
    status: 'Approved',
  },
  { name: 'Maya Chen', from: 'Apr 1', to: 'Apr 3', reason: 'Medical', status: 'Pending' },
];

export default function ClientStaffPage() {
  const [tab, setTab] = useState<'schedule' | 'leave'>('schedule');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            Staff & Scheduling
          </h2>
          <p className="text-on-surface-variant mt-1">
            Manage shifts, leave requests, and team scheduling.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Staff',
            value: '12',
            icon: 'badge',
            bg: 'bg-primary/10',
            color: 'text-primary',
          },
          {
            label: 'On Duty Today',
            value: '9',
            icon: 'check_circle',
            bg: 'bg-secondary/10',
            color: 'text-secondary',
          },
          {
            label: 'On Leave',
            value: '1',
            icon: 'event_busy',
            bg: 'bg-error/10',
            color: 'text-error',
          },
          {
            label: 'Pending Requests',
            value: '2',
            icon: 'pending',
            bg: 'bg-tertiary/10',
            color: 'text-tertiary',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}
            >
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-2xl font-bold font-headline text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-surface-container-low p-1 rounded-xl w-fit gap-1">
        {(['schedule', 'leave'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            {t === 'schedule' ? 'Weekly Schedule' : 'Leave Requests'}
          </button>
        ))}
      </div>

      {tab === 'schedule' ? (
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-xl font-bold font-headline mb-6 text-on-surface">
            Week of March 18–23, 2024
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Staff Member
                  </th>
                  {days.map((d) => (
                    <th
                      key={d}
                      className="pb-4 text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
                    >
                      {d}
                    </th>
                  ))}
                  <th className="pb-4 text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Shifts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${s.color}`}
                        >
                          {s.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{s.name}</p>
                          <p className="text-xs text-on-surface-variant">{s.role}</p>
                        </div>
                      </div>
                    </td>
                    {s.schedule.map((worked, i) => (
                      <td key={i} className="py-4 text-center">
                        {worked ? (
                          <span className="inline-block w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '14px' }}
                            >
                              check
                            </span>
                          </span>
                        ) : (
                          <span className="inline-block w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant/30 flex items-center justify-center">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '14px' }}
                            >
                              remove
                            </span>
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-4 text-center">
                      <span
                        className={`text-sm font-bold ${s.schedule.filter(Boolean).length > 0 ? 'text-on-surface' : 'text-error'}`}
                      >
                        {s.schedule.filter(Boolean).length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-xl font-bold font-headline mb-6 text-on-surface">Leave Requests</h4>
          <div className="space-y-4">
            {leaveRequests.map((req, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-5 rounded-xl border border-outline-variant/20 hover:border-primary/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {req.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-on-surface">{req.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {req.from} – {req.to} · {req.reason}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}
                >
                  {req.status}
                </span>
                {req.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-all">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 bg-error/10 text-error rounded-lg text-xs font-bold hover:bg-error/20 transition-all">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
