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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header halaman */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>
            Transaksi 💳
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
            Kelola semua transaksi kamu
          </p>
        </div>
        <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="neu-btn-primary">
          <Plus size={18} /> Tambah
        </button>
      </div>

      {/* Summary kartu */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="neu-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#DCFCE7', border: '2px solid #2B3440', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div>
          <div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Total Pemasukan</p>
            <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: '#22C55E', fontSize: '18px', margin: 0 }}>{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="neu-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#ffd9df', border: '2px solid #2B3440', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💸</div>
          <div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Total Pengeluaran</p>
            <p style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: '#EF4444', fontSize: '18px', margin: 0 }}>{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="neu-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', borderRadius: '16px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="neu-input"
            style={{ paddingLeft: '36px', paddingTop: '8px', paddingBottom: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['all', 'income', 'expense'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '2px solid #2B3440',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                background: filterType === t ? '#2B3440' : 'white',
                color: filterType === t ? 'white' : '#6B7280',
                boxShadow: filterType === t ? '2px 2px 0px #2B3440' : 'none',
              }}
            >
              {t === 'all' ? 'Semua' : t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          ))}
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="neu-input"
          style={{ paddingTop: '8px', paddingBottom: '8px', width: '160px' }}
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Tabel transaksi */}
      <div className="neu-card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #22C55E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B3440', margin: '0 0 4px 0' }}>Tidak ada transaksi</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Coba ubah filter atau tambah transaksi baru</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #2B3440', background: '#f3fcef' }}>
                  {['Deskripsi', 'Kategori', 'Tanggal', 'Jumlah', 'Aksi'].map((h, i) => (
                    <th key={h} style={{ padding: '16px', fontFamily: 'Fredoka, sans-serif', color: '#2B3440', fontWeight: 700, textAlign: i === 3 ? 'right' : i === 4 ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #e8f0e4', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3fcef')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}</span>
                        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#2B3440', fontWeight: 500, margin: 0 }}>
                          {tx.description || 'Tanpa deskripsi'}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className="neu-badge" style={{ background: '#e8f0e4', color: '#2B3440', fontSize: '12px' }}>
                        {tx.categories?.name || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px', color: '#6B7280' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '15px', color: tx.type === 'income' ? '#22C55E' : '#EF4444' }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => { setEditData(tx); setShowForm(true); }}
                          style={{ padding: '8px', borderRadius: '8px', border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#22C55E'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = 'inherit'; }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          style={{ padding: '8px', borderRadius: '8px', border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = 'inherit'; }}
                        >
                          <Trash2 size={15} />
                        </button>
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