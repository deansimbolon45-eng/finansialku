'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { Transaction } from '@/types/database';

const COLORS = ['#22C55E','#EF4444','#F59E0B','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316'];

export default function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const byCategory: Record<string, { name: string; value: number }> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const key = t.category_id || 'other';
      const name = t.categories?.name || 'Lainnya';
      if (!byCategory[key]) byCategory[key] = { name, value: 0 };
      byCategory[key].value += t.amount;
    });
    return Object.values(byCategory).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [transactions]);

  return (
    <div className="neu-card p-5">
      <h3 className="font-fredoka text-lg font-bold text-[#2B3440] mb-4">Kategori Pengeluaran</h3>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="font-poppins text-[#9CA3AF] text-sm">Belum ada pengeluaran bulan ini</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#2B3440" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
  formatter={(val) => typeof val === 'number' ? formatCurrency(val) : String(val)} 
  contentStyle={{ fontFamily: 'Poppins', fontSize: 12, borderRadius: '10px', border: '2px solid #2B3440' }} 
/>
            <Legend formatter={(val) => <span style={{ fontFamily: 'Fredoka', fontSize: 13 }}>{val}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}