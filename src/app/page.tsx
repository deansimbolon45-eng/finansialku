'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/lib/formatters';
import FloatingButton from '@/components/layout/FloatingButton';
import TransactionForm from '@/components/transactions/TransactionForm';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
const endOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`;

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { transactions, totalIncome, totalExpense, loading, refetch } = useTransactions({
    startDate: startOfMonth,
    endDate: endOfMonth,
  });
  const { goals } = useSavingsGoals();
  const balance = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="neu-card p-5" style={{ background: '#22C55E' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p className="font-fredoka font-bold text-white" style={{ fontSize: '18px' }}>Saldo Saat Ini</p>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={28} color="white" />
            </div>
          </div>
          <p className="font-fredoka font-bold text-white" style={{ fontSize: '28px' }}>{loading ? '...' : formatCurrency(balance)}</p>
          <p className="font-poppins text-white" style={{ fontSize: '12px', marginTop: '4px' }}>Bulan ini</p>
        </div>

        <div className="neu-card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p className="font-fredoka font-bold text-[#2B3440]" style={{ fontSize: '18px' }}>Total Pemasukan</p>
            <div style={{ width: '48px', height: '48px', background: '#DCFCE7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={28} color="#22C55E" />
            </div>
          </div>
          <p className="font-fredoka font-bold text-[#22C55E]" style={{ fontSize: '24px' }}>{loading ? '...' : formatCurrency(totalIncome)}</p>
          <p className="font-poppins text-[#9CA3AF]" style={{ fontSize: '12px', marginTop: '4px' }}>Bulan ini</p>
        </div>

        <div className="neu-card p-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p className="font-fredoka font-bold text-[#2B3440]" style={{ fontSize: '18px' }}>Total Pengeluaran</p>
            <div style={{ width: '48px', height: '48px', background: '#FEF2F2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={28} color="#EF4444" />
            </div>
          </div>
          <p className="font-fredoka font-bold text-[#EF4444]" style={{ fontSize: '24px' }}>{loading ? '...' : formatCurrency(totalExpense)}</p>
          <p className="font-poppins text-[#9CA3AF]" style={{ fontSize: '12px', marginTop: '4px' }}>Bulan ini</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CashFlowChart />
        <ExpenseChart transactions={transactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="neu-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-fredoka text-lg font-bold text-[#2B3440]">Transaksi Terbaru</h3>
            <Link href="/transaksi" className="flex items-center gap-1 text-[#22C55E] font-fredoka text-sm font-semibold hover:underline">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-[#F3F4F6] rounded-[10px] animate-pulse" />)}</div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">💸</p>
              <p className="font-poppins text-[#9CA3AF] text-sm">Belum ada transaksi bulan ini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-[10px] border-2 border-[#F3F4F6] hover:border-[#2B3440] transition-colors">
                  <div className="w-9 h-9 rounded-[10px] bg-[#F3F4F6] flex items-center justify-center text-lg flex-shrink-0">
                    {tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-fredoka font-semibold text-[#2B3440] text-sm truncate">{tx.description || tx.categories?.name || 'Transaksi'}</p>
                    <p className="font-poppins text-xs text-[#9CA3AF]">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <p className={`font-fredoka font-bold text-sm flex-shrink-0 ${tx.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="neu-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-fredoka text-lg font-bold text-[#2B3440]">Target Tabungan</h3>
            <Link href="/tabungan" className="flex items-center gap-1 text-[#22C55E] font-fredoka text-sm font-semibold hover:underline">
              Kelola <ArrowRight size={14} />
            </Link>
          </div>
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🎯</p>
              <p className="font-poppins text-[#9CA3AF] text-sm">Belum ada target tabungan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{goal.icon}</span>
                        <p className="font-fredoka font-semibold text-[#2B3440] text-sm">{goal.name}</p>
                      </div>
                      <span className="font-fredoka font-bold text-sm" style={{ color: goal.color }}>{percent}%</span>
                    </div>
                    <div className="neu-progress">
                      <div className="neu-progress-fill" style={{ width: `${percent}%`, background: goal.color }} />
                    </div>
                    <div className="flex justify-between">
                      <p className="font-poppins text-xs text-[#9CA3AF]">{formatCurrency(goal.current_amount)}</p>
                      <p className="font-poppins text-xs text-[#9CA3AF]">{formatCurrency(goal.target_amount)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <FloatingButton onClick={() => setShowForm(true)} />
      {showForm && <TransactionForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refetch(); }} />}
    </div>
  );
}