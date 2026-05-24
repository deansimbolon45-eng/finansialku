'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { SavingsGoal } from '@/types/database';
import { Plus, Edit2, Trash2, PlusCircle, X, Loader2 } from 'lucide-react';

const EMOJI_OPTIONS = ['🎯','🏠','🚗','✈️','💻','📱','🎓','💍','🏖️','🐶','🛍️','💰'];
const COLOR_OPTIONS = ['#22C55E','#3B82F6','#8B5CF6','#EC4899','#F59E0B','#EF4444','#14B8A6','#F97316'];

function GoalForm({ editData, onClose, onSuccess }: { editData?: SavingsGoal; onClose: () => void; onSuccess: () => void; }) {
  const { addGoal, updateGoal } = useSavingsGoals();
  const [name, setName] = useState(editData?.name || '');
  const [targetAmount, setTargetAmount] = useState(editData?.target_amount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(editData?.current_amount?.toString() || '0');
  const [targetDate, setTargetDate] = useState(editData?.target_date || '');
  const [icon, setIcon] = useState(editData?.icon || '🎯');
  const [color, setColor] = useState(editData?.color || '#22C55E');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name, target_amount: Number(targetAmount), current_amount: Number(currentAmount),
      target_date: targetDate || null, icon, color,
      is_completed: Number(currentAmount) >= Number(targetAmount),
    };
    let error;
    if (editData) error = await updateGoal(editData.id, payload);
    else error = await addGoal(payload as any);
    setLoading(false);
    if (!error) onSuccess();
  }

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px', boxSizing: 'border-box' }}>
      <div className="neu-card bg-white w-full" style={{ maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5 border-b-[3px] border-[#2B3440]">
          <h3 className="font-fredoka text-xl font-bold text-[#2B3440]">{editData ? 'Edit Target' : 'Buat Target Tabungan'} 🎯</h3>
          <button onClick={onClose}><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-2">Pilih Ikon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  className={`w-10 h-10 text-xl rounded-[10px] border-2 transition-all ${icon === e ? 'border-[#2B3440] bg-[#DCFCE7] scale-110' : 'border-[#E5E7EB]'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-2">Warna</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-[3px] transition-all ${color === c ? 'border-[#2B3440] scale-125' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Nama Target</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Beli Laptop" required className="neu-input" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Target Jumlah (Rp)</label>
            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0" required min="1" className="neu-input" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Sudah Terkumpul (Rp)</label>
            <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="0" min="0" className="neu-input" />
          </div>
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Target Tanggal (opsional)</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="neu-input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="neu-btn-secondary flex-1 justify-center">Batal</button>
            <button type="submit" disabled={loading} className="neu-btn-primary flex-1 justify-center">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Menyimpan...' : (editData ? 'Simpan' : 'Buat Target')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function TabunganPage() {
  const { goals, loading, deleteGoal, updateGoal, refetch } = useSavingsGoals();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<SavingsGoal | undefined>();
  const [addingFundsId, setAddingFundsId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  async function handleDelete(id: string) {
    if (!confirm('Hapus target ini?')) return;
    await deleteGoal(id);
  }

  async function handleAddFunds(goal: SavingsGoal) {
    if (!addAmount || Number(addAmount) <= 0) return;
    const newAmount = Math.min(goal.current_amount + Number(addAmount), goal.target_amount);
    await updateGoal(goal.id, { current_amount: newAmount, is_completed: newAmount >= goal.target_amount });
    setAddingFundsId(null);
    setAddAmount('');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fredoka text-2xl font-bold text-[#2B3440]">Target Tabungan 🐷</h1>
          <p className="font-poppins text-sm text-[#9CA3AF]">Kelola tujuan keuanganmu</p>
        </div>
        <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="neu-btn-primary">
          <Plus size={18} /> Buat Target
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="neu-card p-4 text-center">
          <p className="font-fredoka text-2xl font-bold text-[#2B3440]">{goals.length}</p>
          <p className="font-poppins text-xs text-[#9CA3AF]">Total Target</p>
        </div>
        <div className="neu-card p-4 text-center">
          <p className="font-fredoka text-2xl font-bold text-[#22C55E]">{goals.filter(g => g.is_completed).length}</p>
          <p className="font-poppins text-xs text-[#9CA3AF]">Tercapai</p>
        </div>
        <div className="neu-card p-4 text-center">
          <p className="font-fredoka text-2xl font-bold text-[#F59E0B]">{goals.filter(g => !g.is_completed).length}</p>
          <p className="font-poppins text-xs text-[#9CA3AF]">Dalam Proses</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 neu-card animate-pulse bg-[#F3F4F6]" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="neu-card p-12 text-center">
          <p className="text-5xl mb-3">🎯</p>
          <p className="font-fredoka text-xl font-bold text-[#2B3440] mb-2">Belum ada target!</p>
          <p className="font-poppins text-sm text-[#9CA3AF] mb-4">Mulai buat target tabunganmu sekarang</p>
          <button onClick={() => setShowForm(true)} className="neu-btn-primary"><Plus size={18} /> Buat Target Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
            return (
              <div key={goal.id} className="neu-card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[10px] border-[3px] border-[#2B3440] flex items-center justify-center text-2xl" style={{ background: `${goal.color}20` }}>
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-fredoka text-lg font-bold text-[#2B3440]">{goal.name}</h3>
                      {goal.target_date && <p className="font-poppins text-xs text-[#9CA3AF]">Target: {formatDate(goal.target_date)}</p>}
                    </div>
                  </div>
                  {goal.is_completed && <span className="neu-badge bg-[#DCFCE7] text-[#22C55E]">✅ Tercapai!</span>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-poppins text-sm text-[#6B7280]">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</p>
                    <p className="font-fredoka font-bold text-lg" style={{ color: goal.color }}>{percent}%</p>
                  </div>
                  <div className="neu-progress">
                    <div className="neu-progress-fill" style={{ width: `${percent}%`, background: goal.color }} />
                  </div>
                </div>

                {addingFundsId === goal.id ? (
                  <div className="flex gap-2">
                    <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="Jumlah (Rp)" className="neu-input flex-1 text-sm py-2" autoFocus />
                    <button onClick={() => handleAddFunds(goal)} className="neu-btn-primary py-2 px-3 text-sm">✓</button>
                    <button onClick={() => { setAddingFundsId(null); setAddAmount(''); }} className="neu-btn-secondary py-2 px-3 text-sm">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {!goal.is_completed && (
                      <button onClick={() => setAddingFundsId(goal.id)} className="neu-btn-primary flex-1 justify-center text-sm py-2">
                        <PlusCircle size={16} /> Tambah Dana
                      </button>
                    )}
                    <button onClick={() => { setEditData(goal); setShowForm(true); }} className="p-2 rounded-[10px] border-2 border-[#E5E7EB] hover:border-[#22C55E] hover:text-[#22C55E] transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(goal.id)} className="p-2 rounded-[10px] border-2 border-[#E5E7EB] hover:border-[#EF4444] hover:text-[#EF4444] transition-all"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <GoalForm
          editData={editData}
          onClose={() => { setShowForm(false); setEditData(undefined); }}
          onSuccess={() => { setShowForm(false); setEditData(undefined); refetch(); }}
        />
      )}
    </div>
  );
}