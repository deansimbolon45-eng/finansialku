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
      <div className="neu-card bg-white w-full" style={{ maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '3px solid #2B3440' }}>
          <h3 className="font-fredoka text-xl font-bold text-[#2B3440]">{editData ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
          <button onClick={onClose} className="p-1 hover:text-[#EF4444]"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => { setType('expense'); setCategoryId(''); }}
              className={`flex-1 py-2 rounded-[10px] border-[3px] font-fredoka font-semibold transition-all ${type === 'expense' ? 'bg-[#EF4444] text-white border-[#2B3440]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'}`}>
              Pengeluaran
            </button>
            <button type="button" onClick={() => { setType('income'); setCategoryId(''); }}
              className={`flex-1 py-2 rounded-[10px] border-[3px] font-fredoka font-semibold transition-all ${type === 'income' ? 'bg-[#22C55E] text-white border-[#2B3440]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'}`}>
              Pemasukan
            </button>
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Jumlah (Rp)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" required min="1" className="neu-input text-xl font-fredoka font-bold" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Deskripsi</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Contoh: Makan siang, Gaji bulan ini..." className="neu-input" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Kategori</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="neu-input">
              <option value="">Pilih kategori</option>
              {filteredCategories.map(c => (<option key={c.id} value={c.id}>{c.icon} {c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Tanggal</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="neu-input" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Catatan (opsional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tambahkan catatan..." rows={2} className="neu-input resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="neu-btn-secondary flex-1 justify-center">Batal</button>
            <button type="submit" disabled={loading} className="neu-btn-primary flex-1 justify-center">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
