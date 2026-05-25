'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { Transaction } from '@/types/database';

const COLORS = ['#a5d8ff', '#22C55E', '#ffd9df', '#F59E0B', '#e197a7', '#6bff8f'];

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

  if (data.length === 0) {
    return (
      <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#9CA3AF', fontSize: '14px' }}>
          Belum ada pengeluaran bulan ini
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#2B3440" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(val) => (typeof val === 'number' ? formatCurrency(val) : String(val))}
          contentStyle={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, borderRadius: '12px', border: '2px solid #2B3440', boxShadow: '3px 3px 0px #2B3440' }}
        />
        <Legend formatter={(val) => <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 13 }}>{val}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}