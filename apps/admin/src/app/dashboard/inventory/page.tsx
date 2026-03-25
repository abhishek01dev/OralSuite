"use client";
import { useState } from "react";

const items = [
  { id: 'INV-001', name: 'Dental Composite Resin A2', category: 'Restorative', unit: 'Pack (5g)', qty: 48, minQty: 20, supplier: 'DentSupply Co.', cost: '$28.00', status: 'In Stock' },
  { id: 'INV-002', name: 'Articaine HCI 4% Anesthetic', category: 'Anesthetics', unit: 'Box (50 cartridges)', qty: 12, minQty: 15, supplier: 'MedPharm Ltd.', cost: '$95.00', status: 'Low Stock' },
  { id: 'INV-003', name: 'Disposable Nitrile Gloves (L)', category: 'PPE', unit: 'Box (100)', qty: 85, minQty: 30, supplier: 'SafeGuard Inc.', cost: '$18.50', status: 'In Stock' },
  { id: 'INV-004', name: 'X-Ray Phosphor Storage Plates', category: 'Diagnostics', unit: 'Set of 4', qty: 3, minQty: 5, cost: '$220.00', supplier: 'ImagingPro', status: 'Low Stock' },
  { id: 'INV-005', name: 'Prophy Paste Mint Flavor', category: 'Preventative', unit: 'Jar (200g)', qty: 32, minQty: 10, supplier: 'DentSupply Co.', cost: '$12.00', status: 'In Stock' },
  { id: 'INV-006', name: 'Surgical Sutures (3-0)', category: 'Surgery', unit: 'Box (12)', qty: 0, minQty: 5, supplier: 'MedPharm Ltd.', cost: '$45.00', status: 'Out of Stock' },
];

const statusStyle: Record<string, string> = {
  'In Stock': 'bg-secondary/10 text-secondary',
  'Low Stock': 'bg-tertiary/10 text-tertiary',
  'Out of Stock': 'bg-error/10 text-error',
};

export default function InventoryPage() {
  const [catFilter, setCatFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = items.filter(i => catFilter === 'All' || i.category === catFilter);

  const lowStockCount = items.filter(i => i.qty < i.minQty).length;

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">Inventory Management</h2>
          <p className="text-on-surface-variant">Monitor stock levels and supplies across all tenant clinics.</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Item
        </button>
      </div>

      {/* Alert Banner */}
      {lowStockCount > 0 && (
        <div className="mb-6 bg-error/10 border border-error/20 text-error rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          <p className="font-semibold text-sm">{lowStockCount} items are below minimum stock levels and require attention.</p>
          <button className="ml-auto text-xs font-bold underline underline-offset-2">Review Now</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Items', value: items.length.toString(), icon: 'inventory_2', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'In Stock', value: items.filter(i => i.status === 'In Stock').length.toString(), icon: 'check_circle', color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Low Stock', value: items.filter(i => i.status === 'Low Stock').length.toString(), icon: 'warning_amber', color: 'text-tertiary', bg: 'bg-tertiary/10' },
          { label: 'Out of Stock', value: items.filter(i => i.status === 'Out of Stock').length.toString(), icon: 'do_not_disturb_on', color: 'text-error', bg: 'bg-error/10' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-extrabold font-manrope text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${catFilter === c ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Item', 'Category', 'Unit', 'Qty / Min', 'Supplier', 'Unit Cost', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map(item => (
                <tr key={item.id} className={`hover:bg-surface-container-low/30 transition-colors ${item.status === 'Out of Stock' ? 'opacity-70' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{item.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-bold ${item.qty < item.minQty ? 'text-error' : 'text-on-surface'}`}>{item.qty}</span>
                      <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.qty === 0 ? 'bg-error' : item.qty < item.minQty ? 'bg-tertiary' : 'bg-secondary'}`}
                          style={{ width: `${Math.min((item.qty / (item.minQty * 3)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{item.supplier}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">{item.cost}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[item.status]}`}>{item.status}</span>
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
      </section>
    </>
  );
}
