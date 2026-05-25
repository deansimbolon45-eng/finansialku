'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/lib/formatters';
import FloatingButton from '@/components/layout/FloatingButton';
import TransactionForm from '@/components/transactions/TransactionForm';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import { ArrowRight, Plus, ArrowRightLeft, Receipt } from 'lucide-react';
import Link from 'next/link';

const currentMonth = new Date().getMonth() + 1;
const currentYear  = new Date().getFullYear();
const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
const endOfMonth   = `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`;

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { transactions, totalIncome, totalExpense, loading, refetch } = useTransactions({
    startDate: startOfMonth,
    endDate: endOfMonth,
  });
  const { goals } = useSavingsGoals();
  const balance = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>

      {/* ── ROW 1: Saldo (6) | Pemasukan (3) | Pengeluaran (3) ── */}

      <div style={{ gridColumn: 'span 6' }}>
        <div className="neu-card" style={{ background: '#22C55E', borderRadius: '24px', padding: '32px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '16px', fontWeight: 700, color: '#004b1e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Total Saldo
            </p>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '42px', fontWeight: 700, color: '#004b1e', margin: 0, lineHeight: 1.1 }}>
              {loading ? 'Memuat...' : formatCurrency(balance)}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 16px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.4)' }}>
              <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '12px', fontWeight: 600, color: 'white', margin: 0 }}>Bulan ini</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', color: '#4B5563', margin: '0 0 4px 0' }}>Pemasukan</p>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '24px', fontWeight: 700, color: '#2B3440', margin: 0 }}>
            {loading ? '...' : formatCurrency(totalIncome)}
          </h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#22C55E', marginTop: '4px' }}>Bulan ini</p>
        </div>
      </div>

      <div style={{ gridColumn: 'span 3' }}>
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
          <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', color: '#4B5563', margin: '0 0 4px 0' }}>Pengeluaran</p>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '24px', fontWeight: 700, color: '#2B3440', margin: 0 }}>
            {loading ? '...' : formatCurrency(totalExpense)}
          </h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>Bulan ini</p>
        </div>
      </div>

      {/* ── ROW 2: Arus Kas (8) | Target Tabungan (4) ── */}

      <div style={{ gridColumn: 'span 8' }}>
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: '0 0 24px 0' }}>Arus Kas</h3>
          <CashFlowChart />
        </div>
      </div>

      <div style={{ gridColumn: 'span 4' }}>
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Target Tabungan</h3>
            <Link href="/tabungan" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22C55E', fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Kelola <ArrowRight size={14} />
            </Link>
          </div>
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</p>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#9CA3AF', fontSize: '14px' }}>Belum ada target tabungan</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {goals.slice(0, 3).map(goal => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
                return (
                  <div key={goal.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, color: '#2B3440', margin: 0 }}>{goal.icon} {goal.name}</p>
                        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#4B5563', margin: 0 }}>
                          {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                        </p>
                      </div>
                      <span style={{ padding: '2px 8px', background: '#a5d8ff', border: '2px solid #2B3440', borderRadius: '8px', fontSize: '10px', fontWeight: 700, fontFamily: 'Fredoka, sans-serif', boxShadow: '2px 2px 0px #2B3440' }}>
                        {percent}%
                      </span>
                    </div>
                    <div className="neu-progress">
                      <div className="neu-progress-fill" style={{ width: `${percent}%`, background: goal.color || '#a5d8ff' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Riwayat Transaksi (8) | Quick Actions + Chart (4) ── */}

      <div style={{ gridColumn: 'span 8' }}>
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Riwayat Transaksi</h3>
            <Link href="/transaksi" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22C55E', fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4].map(i => <div key={i} style={{ height: '64px', background: '#F3F4F6', borderRadius: '12px' }} />)}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '40px', marginBottom: '8px' }}>💸</p>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#9CA3AF', fontSize: '14px' }}>Belum ada transaksi bulan ini</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentTransactions.map(tx => (
                <div key={tx.id} className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', cursor: 'pointer' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tx.type === 'income' ? '#DCFCE7' : '#ffd9df', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', fontSize: '15px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description || tx.categories?.name || 'Transaksi'}
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#4B5563', margin: 0 }}>
                      {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {tx.categories?.name ? ` • ${tx.categories.name}` : ''}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '16px', flexShrink: 0, color: tx.type === 'income' ? '#22C55E' : '#EF4444', margin: 0 }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Quick Actions */}
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: '0 0 24px 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#22C55E', border: '2px solid #2B3440', boxShadow: '4px 4px 0px #2B3440', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.1s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '5px 5px 0px #2B3440'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #2B3440'; }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={24} color="white" />
              </div>
              <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '16px', fontWeight: 600, color: 'white' }}>Tambah Transaksi</span>
            </button>

            <Link href="/laporan" style={{ textDecoration: 'none' }}>
              <div className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#FFFFFF', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#a5d8ff', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRightLeft size={22} color="#285f80" />
                </div>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B3440' }}>Lihat Laporan</span>
              </div>
            </Link>

            <Link href="/tabungan" style={{ textDecoration: 'none' }}>
              <div className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#FFFFFF', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e197a7', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Receipt size={22} color="#652e3c" />
                </div>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B3440' }}>Kelola Tabungan</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Kategori Pengeluaran */}
        <div className="neu-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', flex: 1 }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: '0 0 24px 0' }}>Kategori Pengeluaran</h3>
          <ExpenseChart transactions={transactions} />
        </div>
      </div>

      <FloatingButton onClick={() => setShowForm(true)} />
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); refetch(); }}
        />
      )}
    </div>
  );
}