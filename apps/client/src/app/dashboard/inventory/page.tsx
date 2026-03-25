"use client";
import { useState, useEffect } from "react";
import { useInventoryStore, InventoryItem } from "@/lib/inventory-store";
import { formatCurrency } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  'In Stock': 'bg-secondary/10 text-secondary',
  'Low Stock': 'bg-tertiary/10 text-tertiary',
  'Out of Stock': 'bg-error/10 text-error',
};

export default function ClientInventoryPage() {
  const [catFilter, setCatFilter] = useState('All');
  const { items, fetchItems, isLoading } = useInventoryStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.unit || 'General')))];
  const filtered = items.filter(i => catFilter === 'All' || i.unit === catFilter);
  const lowStock = items.filter(i => i.quantity < i.minQuantity).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Inventory</h2>
          <p className="text-on-surface-variant mt-1">Manage clinic supplies, stock levels, and reorders.</p>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Item
        </button>
      </div>

      {lowStock > 0 && (
        <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          <p className="font-semibold text-sm">{lowStock} items need restocking.</p>
          <button className="ml-auto text-xs font-bold underline">Review</button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: items.length.toString(), icon: 'inventory_2', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'In Stock', value: items.filter(i => i.quantity >= i.minQuantity).length.toString(), icon: 'check_circle', bg: 'bg-secondary/10', color: 'text-secondary' },
          { label: 'Low Stock', value: items.filter(i => i.quantity > 0 && i.quantity < i.minQuantity).length.toString(), icon: 'warning_amber', bg: 'bg-tertiary/10', color: 'text-tertiary' },
          { label: 'Out of Stock', value: items.filter(i => i.quantity === 0).length.toString(), icon: 'block', bg: 'bg-error/10', color: 'text-error' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-bold font-headline text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${catFilter === c ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse text-on-surface-variant font-headline font-bold">
            Scanning inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center italic text-on-surface-variant">
            No items found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  {['Item / SKU', 'Unit', 'Qty / Min', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map(item => {
                  const status = item.quantity === 0 ? 'Out of Stock' : item.quantity < item.minQuantity ? 'Low Stock' : 'In Stock';
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{item.name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mt-0.5">{item.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{item.unit || 'UNITS'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm font-bold ${item.quantity < item.minQuantity ? 'text-error' : 'text-on-surface'}`}>{item.quantity} / {item.minQuantity}</span>
                          <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.quantity===0 ? 'bg-error' : item.quantity<item.minQuantity ? 'bg-tertiary' : 'bg-secondary'}`}
                              style={{ width: `${Math.min((item.quantity/(item.minQuantity||1))*50, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle[status]}`}>{status}</span></td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
