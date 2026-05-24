'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getMonthName } from '@/lib/formatters';

export default function CashFlowChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const year = new Date().getFullYear();
      const { data: txs } = await supabase
        .from('transactions')
        .select('type, amount, date')
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`);

      const monthlyData: Record<number, { income: number; expense: number }> = {};
      for (let m = 1; m <= 12; m++) monthlyData[m] = { income: 0, expense: 0 };

      txs?.forEach(tx => {
        const m = new Date(tx.date).getMonth() + 1;
        if (tx.type === 'income') monthlyData[m].income += tx.amount;
        else monthlyData[m].expense += tx.amount;
      });

      setData(
        Object.entries(monthlyData).map(([month, vals]) => ({
          month: getMonthName(Number(month)).slice(0, 3),
          Pemasukan: vals.income,
          Pengeluaran: vals.expense,
        }))
      );
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="neu-card p-5">
      <h3 className="font-fredoka text-lg font-bold text-[#2B3440] mb-4">Arus Kas Bulanan</h3>
      {loading ? (
        <div className="h-48 bg-[#F3F4F6] rounded-[10px] animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontFamily: 'Fredoka', fontSize: 12 }} />
            <YAxis tick={{ fontFamily: 'Poppins', fontSize: 10 }} tickFormatter={(v) => `${v/1000000}jt`} />
            <Tooltip 
  formatter={(val) => typeof val === 'number' ? formatCurrency(val) : String(val)} 
  contentStyle={{ fontFamily: 'Poppins', fontSize: 12, borderRadius: '10px', border: '2px solid #2B3440' }} 
/>
            <Legend />
            <Area type="monotone" dataKey="Pemasukan" stroke="#22C55E" strokeWidth={2.5} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="Pengeluaran" stroke="#EF4444" strokeWidth={2.5} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}