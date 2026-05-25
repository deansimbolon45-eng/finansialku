'use client';

import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, getMonthName } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: getMonthName(i + 1), value: i + 1 }));
const YEARS  = [2024, 2025, 2026].reverse();

export default function LaporanPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear]   = useState(currentDate.getFullYear());

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate   = `${year}-${String(month).padStart(2, '0')}-31`;

  const { transactions, totalIncome, totalExpense } = useTransactions({ startDate, endDate });
  const balance     = totalIncome - totalExpense;
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
    return Object.entries(map)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([day, vals]) => ({ day, ...vals }));
  }, [transactions]);

  async function handleExportExcel() {
    const { utils, writeFile } = await import('xlsx');
    const ws = utils.json_to_sheet(transactions.map(t => ({
      Tanggal: t.date,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.categories?.name || '-',
      Deskripsi: t.description || '-',
      Jumlah: t.amount,
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Transaksi');
    writeFile(wb, `laporan-${getMonthName(month)}-${year}.xlsx`);
  }

  const summaryCards = [
    { label: 'Pemasukan', value: totalIncome, color: '#22C55E', bg: '#DCFCE7', emoji: '💰' },
    { label: 'Pengeluaran', value: totalExpense, color: '#EF4444', bg: '#ffd9df', emoji: '💸' },
    { label: 'Saldo Bersih', value: balance, color: balance >= 0 ? '#22C55E' : '#EF4444', bg: '#e8f0e4', emoji: '📊' },
    { label: 'Tabungan', value: savingsRate, color: '#285f80', bg: '#a5d8ff', emoji: '🏦', isPercent: true },
  ];

  return (
    <>
      <style>{`
        .laporan-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .laporan-summary {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .laporan-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .laporan-controls {
            width: 100%;
            flex-wrap: wrap;
          }
          .laporan-controls select {
            flex: 1;
          }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div className="laporan-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>
              Laporan 📊
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
              Analisis keuangan bulanan kamu
            </p>
          </div>
          <div className="laporan-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="neu-input"
              style={{ width: '130px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="neu-input"
              style={{ width: '85px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={handleExportExcel} className="neu-btn-secondary" style={{ padding: '10px 14px', gap: '6px', whiteSpace: 'nowrap' }}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="laporan-summary">
          {summaryCards.map(card => (
            <div key={card.label} className="neu-card" style={{ borderRadius: '20px', padding: '16px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: card.bg, border: '2px solid #2B3440',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                }}>
                  {card.emoji}
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '11px', color: '#9CA3AF', margin: 0 }}>
                  {card.label}
                </p>
              </div>
              <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: 700, color: card.color, margin: 0 }}>
                {card.isPercent ? `${card.value}%` : formatCurrency(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Harian */}
        <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: '0 0 20px 0' }}>
            Transaksi Harian — {getMonthName(month)} {year}
          </h3>
          {dailyData.length === 0 ? (
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#9CA3AF', fontSize: '14px' }}>
                Tidak ada transaksi bulan ini
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f0e4" />
                <XAxis dataKey="day" tick={{ fontFamily: 'Fredoka, sans-serif', fontSize: 11, fill: '#4B5563' }} axisLine={{ stroke: '#2B3440' }} />
                <YAxis tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 9, fill: '#4B5563' }} tickFormatter={v => `${v / 1000000}jt`} axisLine={{ stroke: '#2B3440' }} />
                <Tooltip
                  formatter={(val) => (typeof val === 'number' ? formatCurrency(val) : String(val))}
                  contentStyle={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, borderRadius: '12px', border: '2px solid #2B3440' }}
                />
                <Legend formatter={(val) => <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 12 }}>{val}</span>} />
                <Bar dataKey="income" name="Pemasukan" fill="#22C55E" stroke="#2B3440" strokeWidth={1.5} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ffd9df" stroke="#2B3440" strokeWidth={1.5} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pengeluaran per Kategori */}
        {expenseByCategory.length > 0 && (
          <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: '0 0 20px 0' }}>
              Pengeluaran per Kategori
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {expenseByCategory.map((cat, i) => {
                const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0;
                const colors = ['#a5d8ff', '#22C55E', '#ffd9df', '#F59E0B', '#e197a7', '#6bff8f'];
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                        <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, color: '#2B3440', margin: 0 }}>
                          {cat.name}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
                          {pct}%
                        </span>
                        <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: '#EF4444', margin: 0, fontSize: '14px' }}>
                          {formatCurrency(cat.total)}
                        </p>
                      </div>
                    </div>
                    <div className="neu-progress" style={{ height: '10px' }}>
                      <div className="neu-progress-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Daftar Transaksi */}
        <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: '0 0 16px 0' }}>
            Semua Transaksi ({transactions.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
            {transactions.length === 0 ? (
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#9CA3AF', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
                Tidak ada transaksi periode ini
              </p>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px', border: '2px solid #e8f0e4'
                }}>
                  <span style={{ fontSize: '18px' }}>
                    {tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'Fredoka, sans-serif', fontSize: '14px',
                      fontWeight: 600, color: '#2B3440', margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {tx.description || tx.categories?.name || 'Transaksi'}
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '11px', color: '#9CA3AF', margin: 0 }}>
                      {tx.date} · {tx.categories?.name || '-'}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: 'Fredoka, sans-serif', fontWeight: 700,
                    fontSize: '14px', margin: 0, flexShrink: 0,
                    color: tx.type === 'income' ? '#22C55E' : '#EF4444'
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}