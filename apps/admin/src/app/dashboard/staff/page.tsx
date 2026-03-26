'use client';
import { useState } from 'react';

const staff = [
  {
    id: 'STF-001',
    name: 'Dr. Julian Vance',
    initials: 'JV',
    role: 'Chief Surgeon',
    department: 'Surgery',
    clinic: 'North Peak Dental',
    email: 'j.vance@northpeak.com',
    status: 'Active',
    shifts: 5,
  },
  {
    id: 'STF-002',
    name: 'Dr. Priya Aris',
    initials: 'PA',
    role: 'Endodontist',
    department: 'Surgery',
    clinic: 'Ocean Breeze Ortho',
    email: 'p.aris@oceanbreeze.com',
    status: 'Active',
    shifts: 4,
  },
  {
    id: 'STF-003',
    name: 'Maya Chen',
    initials: 'MC',
    role: 'Dental Hygienist',
    department: 'Preventative',
    clinic: 'Smile Center Austin',
    email: 'm.chen@smilecenter.com',
    status: 'Active',
    shifts: 5,
  },
  {
    id: 'STF-004',
    name: "Kevin O'Brien",
    initials: 'KO',
    role: 'Clinic Manager',
    department: 'Admin',
    clinic: 'Lakeside Vista Clinic',
    email: 'k.obrien@lakeside.io',
    status: 'On Leave',
    shifts: 0,
  },
  {
    id: 'STF-005',
    name: 'Aisha Patel',
    initials: 'AP',
    role: 'Billing Specialist',
    department: 'Admin',
    clinic: 'North Peak Dental',
    email: 'a.patel@northpeak.com',
    status: 'Active',
    shifts: 5,
  },
  {
    id: 'STF-006',
    name: 'Tom Reeves',
    initials: 'TR',
    role: 'Radiologist',
    department: 'Diagnostics',
    clinic: 'Pure Dental Hub',
    email: 't.reeves@puredental.com',
    status: 'Active',
    shifts: 3,
  },
];

const deptColors: Record<string, string> = {
  Surgery: 'bg-primary/10 text-primary',
  Preventative: 'bg-secondary/10 text-secondary',
  Admin: 'bg-tertiary/10 text-tertiary',
  Diagnostics: 'bg-surface-container-highest text-on-surface-variant',
};

export default function StaffManagementPage() {
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = ['All', ...Array.from(new Set(staff.map((s) => s.department)))];
  const filtered = staff.filter((s) => deptFilter === 'All' || s.department === deptFilter);

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">
            Staff Management
          </h2>
          <p className="text-on-surface-variant">
            Manage roles, departments, and schedules across all tenant clinics.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Staff',
            value: '284',
            icon: 'badge',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Active Today',
            value: '218',
            icon: 'check_circle',
            color: 'text-secondary',
            bg: 'bg-secondary/10',
          },
          {
            label: 'On Leave',
            value: '16',
            icon: 'event_busy',
            color: 'text-tertiary',
            bg: 'bg-tertiary/10',
          },
          {
            label: 'Departments',
            value: '8',
            icon: 'workspaces',
            color: 'text-on-surface',
            bg: 'bg-surface-container-high',
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

      {/* Department Filter */}
      <div className="flex gap-2 mb-4">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${deptFilter === d ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                  {member.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{member.name}</p>
                  <p className="text-xs text-on-surface-variant">{member.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${member.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}
              >
                {member.status}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${deptColors[member.department]}`}
              >
                {member.role}
              </span>
              <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                {member.department}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Clinic
                </p>
                <p className="text-xs font-semibold text-on-surface">{member.clinic}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-primary/10 hover:text-primary text-on-surface-variant transition-all">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    edit
                  </span>
                </button>
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-all">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    calendar_month
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
