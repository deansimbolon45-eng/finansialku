'use client';

import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, getMonthName } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: getMonthName(i + 1), value: i + 1 }));
const YEARS = [2024, 2025, 2026].reverse();

export default function LaporanPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const { transactions, totalIncome, totalExpense } = useTransactions({ startDate, endDate });
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const expenseByCategory = useMemo(() => {
    const map: Record<string, { name: string; icon: string; total: number }> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const key = t.category_id || 'other';
      if (!map[key]) map[key] = { name: t.categories?.name || 'Lainnya', icon: t.categories?.icon || '💸', total: 0 };
      map[key].total += t.amount;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const dailyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const day = new Date(t.date).getDate().toString();
      if (!map[day]) map[day] = { income: 0, expense: 0 };
      if (t.type === 'income') map[day].income += t.amount;
      else map[day].expense += t.amount;
    });
    return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])).map(([day, vals]) => ({ day, ...vals }));
  }, [transactions]);

  async function handleExportExcel() {
    const { utils, writeFile } = await import('xlsx');
    const ws = utils.json_to_sheet(transactions.map(t => ({
      Tanggal: t.date, Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.categories?.name || '-', Deskripsi: t.description || '-', Jumlah: t.amount,
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Transaksi');
    writeFile(wb, `laporan-${getMonthName(month)}-${year}.xlsx`);
  }

  async function handleExportPDF() {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Laporan Keuangan - ${getMonthName(month)} ${year}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, 14, 35);
    doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, 14, 42);
    doc.text(`Saldo: ${formatCurrency(balance)}`, 14, 49);
    autoTable(doc, {
      startY: 60,
      head: [['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah']],
      body: transactions.map(t => [t.date, t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', t.categories?.name || '-', t.description || '-', formatCurrency(t.amount)]),
    });
    doc.save(`laporan-${getMonthName(month)}-${year}.pdf`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-fredoka text-2xl font-bold text-[#2B3440]">Laporan Keuangan 📊</h1>
          <p className="font-poppins text-sm text-[#9CA3AF]">Analisis keuangan bulananmu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="neu-btn-secondary text-sm py-2 px-3"><Download size={16} /> Excel</button>
          <button onClick={handleExportPDF} className="neu-btn-secondary text-sm py-2 px-3"><Download size={16} /> PDF</button>
        </div>
      </div>

      <div className="neu-card p-4 flex gap-3">
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="neu-input w-40">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="neu-input w-28">
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pemasukan', value: formatCurrency(totalIncome), color: '#22C55E', icon: '💰' },
          { label: 'Total Pengeluaran', value: formatCurrency(totalExpense), color: '#EF4444', icon: '💸' },
          { label: 'Selisih', value: formatCurrency(balance), color: balance >= 0 ? '#22C55E' : '#EF4444', icon: '📊' },
          { label: 'Tingkat Tabungan', value: `${savingsRate}%`, color: '#3B82F6', icon: '🏦' },
        ].map(card => (
          <div key={card.label} className="neu-card p-4">
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="font-fredoka text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="font-poppins text-xs text-[#9CA3AF]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="neu-card p-5">
        <h3 className="font-fredoka text-lg font-bold text-[#2B3440] mb-4">Transaksi Harian</h3>
        {dailyData.length === 0 ? (
          <p className="text-center font-poppins text-[#9CA3AF] py-8">Tidak ada data untuk periode ini</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontFamily: 'Fredoka', fontSize: 12 }} />
              <YAxis tick={{ fontFamily: 'Poppins', fontSize: 10 }} tickFormatter={v => `${v/1000}rb`} />
             <Tooltip 
  formatter={(val) => typeof val === 'number' ? formatCurrency(val) : String(val)} 
  contentStyle={{ fontFamily: 'Poppins', fontSize: 12, borderRadius: '10px', border: '2px solid #2B3440' }} 
/>
              <Legend />
              <Bar dataKey="income" name="Pemasukan" fill="#22C55E" stroke="#2B3440" strokeWidth={1} radius={[4,4,0,0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="#EF4444" stroke="#2B3440" strokeWidth={1} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="neu-card p-5">
        <h3 className="font-fredoka text-lg font-bold text-[#2B3440] mb-4">Rincian Pengeluaran per Kategori</h3>
        {expenseByCategory.length === 0 ? (
          <p className="text-center font-poppins text-[#9CA3AF] py-4">Tidak ada pengeluaran periode ini</p>
        ) : (
          <div className="space-y-3">
            {expenseByCategory.map(cat => {
              const percent = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <p className="font-poppins text-sm font-medium text-[#2B3440]">{cat.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-fredoka font-semibold text-[#EF4444]">{formatCurrency(cat.total)}</p>
                      <p className="font-poppins text-xs text-[#9CA3AF] w-10 text-right">{percent}%</p>
                    </div>
                  </div>
                  <div className="neu-progress h-2">
                    <div className="neu-progress-fill" style={{ width: `${percent}%`, background: '#EF4444' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="neu-card p-5">
        <h3 className="font-fredoka text-lg font-bold text-[#2B3440] mb-4">Semua Transaksi ({transactions.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-3 rounded-[10px] border-2 border-[#F3F4F6]">
              <span className="text-lg">{tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}</span>
              <div className="flex-1">
                <p className="font-poppins text-sm font-medium text-[#2B3440]">{tx.description || tx.categories?.name}</p>
                <p className="font-poppins text-xs text-[#9CA3AF]">{tx.date} · {tx.categories?.name}</p>
              </div>
              <p className={`font-fredoka font-bold text-sm ${tx.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}