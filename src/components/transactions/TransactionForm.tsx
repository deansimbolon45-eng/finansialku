'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import type { Transaction } from '@/types/database';
import { X, Loader2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  editData?: Transaction;
}

export default function TransactionForm({ onClose, onSuccess, editData }: Props) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const [type, setType] = useState<'income' | 'expense'>(editData?.type || 'expense');
  const [amount, setAmount] = useState(editData?.amount?.toString() || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [categoryId, setCategoryId] = useState(editData?.category_id || '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(editData?.notes || '');
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter(c => c.type === type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    const payload = {
      type, amount: Number(amount),
      description: description || null,
      category_id: categoryId || null,
      date, notes: notes || null,
    };
    let error;
    if (editData) { error = await updateTransaction(editData.id, payload); }
    else { error = await addTransaction(payload as any); }
    setLoading(false);
    if (!error) onSuccess();
  }

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px', boxSizing: 'border-box' }}>
      <div className="neu-card" style={{ background: 'white', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px' }}>

        {/* Header modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '2px solid #2B3440' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>
            {editData ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6B7280' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Toggle tipe */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { setType('expense'); setCategoryId(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '9999px',
                border: '2px solid #2B3440',
                background: type === 'expense' ? '#EF4444' : 'white',
                color: type === 'expense' ? 'white' : '#6B7280',
                fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '15px',
                cursor: 'pointer',
                boxShadow: type === 'expense' ? '3px 3px 0px #2B3440' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategoryId(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '9999px',
                border: '2px solid #2B3440',
                background: type === 'income' ? '#22C55E' : 'white',
                color: type === 'income' ? 'white' : '#6B7280',
                fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '15px',
                cursor: 'pointer',
                boxShadow: type === 'income' ? '3px 3px 0px #2B3440' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              Pemasukan
            </button>
          </div>

          {/* Jumlah */}
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              required
              min="1"
              className="neu-input"
              style={{ fontSize: '1.25rem', fontFamily: 'Fredoka, sans-serif', fontWeight: 700 }}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>
              Deskripsi
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang, Gaji bulan ini..."
              className="neu-input"
            />
          </div>

          {/* Kategori */}
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>
              Kategori
            </label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="neu-input">
              <option value="">Pilih kategori</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>
              Tanggal
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="neu-input" />
          </div>

          {/* Catatan */}
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>
              Catatan (opsional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={2}
              className="neu-input"
              style={{ resize: 'none' }}
            />
          </div>

          {/* Tombol aksi */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} className="neu-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Batal
            </button>
            <button type="submit" disabled={loading} className="neu-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Menyimpan...' : (editData ? 'Simpan' : 'Tambah')}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}