'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import TransactionForm from '@/components/transactions/TransactionForm';
import FloatingButton from '@/components/layout/FloatingButton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Transaction } from '@/types/database';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';

export default function TransaksiPage() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Transaction | undefined>();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const { transactions, loading, totalIncome, totalExpense, deleteTransaction, refetch } = useTransactions({
    type: filterType, search, categoryId: filterCategory,
  });
  const { categories } = useCategories();

  async function handleDelete(id: string) {
    if (!confirm('Hapus transaksi ini?')) return;
    await deleteTransaction(id);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-2xl font-bold text-[#2B3440]">Transaksi 💳</h1>
          <p className="font-poppins text-sm text-[#9CA3AF]">Kelola semua transaksi kamu</p>
        </div>
        <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="neu-btn-primary">
          <Plus size={18} /> Tambah
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="neu-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#DCFCE7] rounded-[10px] flex items-center justify-center">💰</div>
          <div>
            <p className="font-poppins text-xs text-[#9CA3AF]">Total Pemasukan</p>
            <p className="font-fredoka font-bold text-[#22C55E]">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="neu-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-[10px] flex items-center justify-center">💸</div>
          <div>
            <p className="font-poppins text-xs text-[#9CA3AF]">Total Pengeluaran</p>
            <p className="font-fredoka font-bold text-[#EF4444]">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="neu-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input type="text" placeholder="Cari transaksi..." value={search} onChange={e => setSearch(e.target.value)} className="neu-input pl-9 py-2 text-sm" />
        </div>
        <div className="flex gap-1">
          {(['all', 'income', 'expense'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-[10px] border-2 font-fredoka text-sm font-semibold transition-all ${filterType === t ? 'bg-[#2B3440] text-white border-[#2B3440]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'}`}>
              {t === 'all' ? 'Semua' : t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          ))}
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="neu-input py-2 text-sm w-40">
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <div className="neu-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="inline-block w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin" /></div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-fredoka text-lg font-semibold text-[#2B3440]">Tidak ada transaksi</p>
            <p className="font-poppins text-sm text-[#9CA3AF]">Coba ubah filter atau tambah transaksi baru</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-[3px] border-[#2B3440] bg-[#F9F9F9]">
                  <th className="text-left p-4 font-fredoka text-[#2B3440]">Deskripsi</th>
                  <th className="text-left p-4 font-fredoka text-[#2B3440]">Kategori</th>
                  <th className="text-left p-4 font-fredoka text-[#2B3440]">Tanggal</th>
                  <th className="text-right p-4 font-fredoka text-[#2B3440]">Jumlah</th>
                  <th className="text-center p-4 font-fredoka text-[#2B3440]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#F3F4F6] hover:bg-[#F9F9F9] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}</span>
                        <p className="font-poppins text-sm text-[#2B3440] font-medium">{tx.description || 'Tanpa deskripsi'}</p>
                      </div>
                    </td>
                    <td className="p-4"><span className="neu-badge bg-[#F3F4F6] text-[#6B7280]">{tx.categories?.name || '-'}</span></td>
                    <td className="p-4 font-poppins text-sm text-[#6B7280]">{formatDate(tx.date)}</td>
                    <td className="p-4 text-right">
                      <span className={`font-fredoka font-bold ${tx.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setEditData(tx); setShowForm(true); }} className="p-2 rounded-[10px] border-2 border-[#E5E7EB] hover:border-[#22C55E] hover:text-[#22C55E] transition-all"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(tx.id)} className="p-2 rounded-[10px] border-2 border-[#E5E7EB] hover:border-[#EF4444] hover:text-[#EF4444] transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FloatingButton onClick={() => { setEditData(undefined); setShowForm(true); }} />
      {showForm && (
        <TransactionForm
          editData={editData}
          onClose={() => { setShowForm(false); setEditData(undefined); }}
          onSuccess={() => { setShowForm(false); setEditData(undefined); refetch(); }}
        />
      )}
    </div>
  );
}