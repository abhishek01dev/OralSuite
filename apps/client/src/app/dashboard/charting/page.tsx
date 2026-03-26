'use client';
import { useState } from 'react';

// Tooth conditions
type ToothCondition =
  | 'healthy'
  | 'cavity'
  | 'crown'
  | 'missing'
  | 'root-canal'
  | 'bridge'
  | 'extraction';

const conditionStyle: Record<ToothCondition, string> = {
  healthy:
    'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-primary/5',
  cavity: 'bg-error/10 border-error/40 text-error',
  crown: 'bg-tertiary/10 border-tertiary/40 text-tertiary',
  missing: 'bg-surface-container-highest border-outline-variant/50 text-outline-variant',
  'root-canal': 'bg-primary/10 border-primary/40 text-primary',
  bridge: 'bg-secondary/10 border-secondary/40 text-secondary',
  extraction: 'bg-surface-container-high border-outline-variant text-on-surface-variant',
};

const conditionLabel: Record<ToothCondition, string> = {
  healthy: 'Healthy',
  cavity: 'Cavity',
  crown: 'Crown',
  missing: 'Missing',
  'root-canal': 'Root Canal',
  bridge: 'Bridge',
  extraction: 'Extraction Site',
};

// Initial tooth state — 32 teeth
const initTeeth: Record<number, ToothCondition> = {
  3: 'crown',
  6: 'cavity',
  14: 'root-canal',
  18: 'missing',
  19: 'bridge',
  30: 'cavity',
};

const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

export default function ChartingPage() {
  const [teeth, setTeeth] = useState<Record<number, ToothCondition>>(initTeeth);
  const [selected, setSelected] = useState<number | null>(null);
  const [brushCondition, setBrushCondition] = useState<ToothCondition>('cavity');
  const [patient] = useState('Sarah Mitchell');
  const [notes, setNotes] = useState(
    'Patient reports sensitivity on upper right. Crown on #3 intact. Follow up on #14 RCT in 6 weeks.',
  );

  const applyCondition = (toothNum: number) => {
    setTeeth((prev) => ({ ...prev, [toothNum]: brushCondition }));
    setSelected(toothNum);
  };

  const conditions: ToothCondition[] = [
    'healthy',
    'cavity',
    'crown',
    'missing',
    'root-canal',
    'bridge',
    'extraction',
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            Dental Charting
          </h2>
          <p className="text-on-surface-variant mt-1">
            Interactive odontogram — click a tooth to apply condition.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest text-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-lg">print</span>
            Print Chart
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            Save Chart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Odontogram */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          {/* Patient Selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                SM
              </div>
              <div>
                <p className="font-bold text-on-surface">{patient}</p>
                <p className="text-xs text-on-surface-variant">DOB: Mar 12, 1986 · P-101</p>
              </div>
            </div>
            <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              Change Patient <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Condition Brush Selector */}
          <div className="mb-6">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
              Active Condition
            </p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <button
                  key={c}
                  onClick={() => setBrushCondition(c)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${conditionStyle[c]} ${brushCondition === c ? 'ring-2 ring-offset-1 ring-primary scale-105' : ''}`}
                >
                  {conditionLabel[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Upper Jaw */}
          <div className="mb-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 text-center">
              Upper Jaw (Maxillary)
            </p>
            <div
              className="grid grid-cols-16 gap-1 flex justify-center mb-3"
              style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}
            >
              {upperTeeth.map((n) => (
                <button
                  key={n}
                  onClick={() => applyCondition(n)}
                  title={`Tooth #${n} · ${conditionLabel[teeth[n] ?? 'healthy']}`}
                  className={`aspect-square rounded-lg border text-[10px] font-bold transition-all hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-0.5 ${conditionStyle[teeth[n] ?? 'healthy']} ${selected === n ? 'ring-2 ring-primary' : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    {teeth[n] === 'missing' ? 'close' : 'dentistry'}
                  </span>
                  <span>{n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-outline-variant/20"></div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Midline
            </span>
            <div className="flex-1 h-px bg-outline-variant/20"></div>
          </div>

          {/* Lower Jaw */}
          <div className="mt-2">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
              {lowerTeeth.map((n) => (
                <button
                  key={n}
                  onClick={() => applyCondition(n)}
                  title={`Tooth #${n} · ${conditionLabel[teeth[n] ?? 'healthy']}`}
                  className={`aspect-square rounded-lg border text-[10px] font-bold transition-all hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-0.5 ${conditionStyle[teeth[n] ?? 'healthy']} ${selected === n ? 'ring-2 ring-primary' : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    {teeth[n] === 'missing' ? 'close' : 'dentistry'}
                  </span>
                  <span>{n}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-2 text-center">
              Lower Jaw (Mandibular)
            </p>
          </div>

          {/* Selected Tooth Info */}
          {selected && (
            <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-primary/10">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Selected
              </p>
              <p className="text-sm font-bold text-on-surface">
                Tooth #{selected} — {conditionLabel[teeth[selected] ?? 'healthy']}
              </p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm">
            <h4 className="text-sm font-bold font-headline mb-4 text-on-surface">
              Condition Legend
            </h4>
            <div className="space-y-2">
              {conditions
                .filter((c) => c !== 'healthy')
                .map((c) => (
                  <div key={c} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border ${conditionStyle[c]}`}></div>
                    <span className="text-sm text-on-surface">{conditionLabel[c]}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Chart Summary */}
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm">
            <h4 className="text-sm font-bold font-headline mb-4 text-on-surface">Chart Summary</h4>
            <div className="space-y-2">
              {conditions
                .filter((c) => c !== 'healthy')
                .map((c) => {
                  const count = Object.values(teeth).filter((v) => v === c).length;
                  if (count === 0) return null;
                  return (
                    <div key={c} className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">{conditionLabel[c]}</span>
                      <span className={`font-bold ${conditionStyle[c].split(' ').pop()}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              <div className="border-t border-outline-variant/20 pt-2 mt-2 flex justify-between text-sm">
                <span className="font-semibold text-on-surface">Total Conditions</span>
                <span className="font-bold text-on-surface">{Object.keys(teeth).length}</span>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm">
            <h4 className="text-sm font-bold font-headline mb-3 text-on-surface">Clinical Notes</h4>
            <textarea
              className="w-full h-32 text-sm bg-surface-container-low rounded-xl p-3 outline-none border border-outline-variant/30 focus:ring-2 focus:ring-primary/10 resize-none text-on-surface placeholder:text-outline-variant"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical notes..."
            />
            <button className="mt-2 w-full py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-all">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
