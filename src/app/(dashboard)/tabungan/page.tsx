'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { SavingsGoal } from '@/types/database';
import { Plus, Edit2, Trash2, PlusCircle, X, Loader2 } from 'lucide-react';

const EMOJI_OPTIONS = ['🎯','🏠','🚗','✈️','💻','📱','🎓','💍','🏖️','🐶','🛍️','💰'];
const COLOR_OPTIONS = ['#22C55E','#a5d8ff','#e197a7','#F59E0B','#EF4444','#ffd9df','#6bff8f','#F97316'];

function GoalForm({ editData, onClose, onSuccess }: { editData?: SavingsGoal; onClose: () => void; onSuccess: () => void }) {
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
      <div className="neu-card" style={{ background: 'white', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '2px solid #2B3440' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>
            {editData ? 'Edit Target' : 'Buat Target Tabungan'} 🎯
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '8px' }}>Pilih Ikon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  style={{ width: '40px', height: '40px', fontSize: '20px', borderRadius: '10px', border: `2px solid ${icon === e ? '#2B3440' : '#E5E7EB'}`, background: icon === e ? '#DCFCE7' : 'white', cursor: 'pointer', transition: 'all 0.1s ease', transform: icon === e ? 'scale(1.1)' : 'none' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '8px' }}>Warna</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${color === c ? '#2B3440' : 'transparent'}`, background: c, cursor: 'pointer', transform: color === c ? 'scale(1.2)' : 'none', transition: 'all 0.1s ease' }} />
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Nama Target</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Beli Laptop" required className="neu-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Target Jumlah (Rp)</label>
            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0" required min="1" className="neu-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Sudah Terkumpul (Rp)</label>
            <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="0" min="0" className="neu-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Target Tanggal (opsional)</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="neu-input" />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} className="neu-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
            <button type="submit" disabled={loading} className="neu-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
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
  const { goals, loading, deleteGoal, refetch } = useSavingsGoals();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<SavingsGoal | undefined>();
  const [addingFunds, setAddingFunds] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const { updateGoal } = useSavingsGoals();

  async function handleAddFunds(goal: SavingsGoal) {
    const amount = Number(fundAmount);
    if (!amount || amount <= 0) return;
    await updateGoal(goal.id, { current_amount: goal.current_amount + amount });
    setAddingFunds(null);
    setFundAmount('');
    refetch();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus target tabungan ini?')) return;
    await deleteGoal(id);
  }

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved  = goals.reduce((s, g) => s + g.current_amount, 0);
  const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Target Tabungan 🎯</h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Wujudkan impianmu satu target sekaligus</p>
        </div>
        <button onClick={() => { setEditData(undefined); setShowForm(true); }} className="neu-btn-primary">
          <Plus size={18} /> Tambah Target
        </button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="neu-card" style={{ background: '#22C55E', borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, color: '#004b1e', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Total Tabungan</p>
              <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '32px', fontWeight: 700, color: '#004b1e', margin: '4px 0 0 0' }}>{formatCurrency(totalSaved)}</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px', color: 'rgba(0,75,30,0.8)', margin: 0 }}>dari {formatCurrency(totalTarget)}</p>
            </div>
            <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '9999px', fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white' }}>
              {overallPct}%
            </span>
          </div>
          <div className="neu-progress" style={{ background: 'rgba(0,0,0,0.15)', height: '12px' }}>
            <div className="neu-progress-fill" style={{ width: `${overallPct}%`, background: 'white' }} />
          </div>
        </div>
      )}

      {/* Daftar goals */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #22C55E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : goals.length === 0 ? (
        <div className="neu-card" style={{ borderRadius: '24px', padding: '64px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</p>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', color: '#2B3440', margin: '0 0 8px 0' }}>Belum ada target tabungan</h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px 0' }}>Mulai buat target pertamamu!</p>
          <button onClick={() => setShowForm(true)} className="neu-btn-primary">
            <Plus size={18} /> Buat Target Pertama
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {goals.map(goal => {
            const pct = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
            const isCompleted = pct >= 100;
            return (
              <div key={goal.id} className="neu-card" style={{ borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header kartu goal */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: goal.color || '#22C55E', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {goal.icon}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '16px', fontWeight: 700, color: '#2B3440', margin: 0 }}>{goal.name}</h3>
                      {goal.target_date && (
                        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Target: {formatDate(goal.target_date)}</p>
                      )}
                    </div>
                  </div>
                  {isCompleted && (
                    <span style={{ padding: '4px 10px', background: '#22C55E', border: '2px solid #2B3440', borderRadius: '9999px', fontFamily: 'Fredoka, sans-serif', fontSize: '11px', fontWeight: 700, color: 'white' }}>✅ Selesai</span>
                  )}
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '20px', fontWeight: 700, color: '#2B3440', margin: 0 }}>{formatCurrency(goal.current_amount)}</p>
                    <span style={{ padding: '2px 10px', background: '#a5d8ff', border: '2px solid #2B3440', borderRadius: '8px', fontFamily: 'Fredoka, sans-serif', fontSize: '12px', fontWeight: 700, boxShadow: '2px 2px 0px #2B3440' }}>{pct}%</span>
                  </div>
                  <div className="neu-progress">
                    <div className="neu-progress-fill" style={{ width: `${pct}%`, background: goal.color || '#22C55E' }} />
                  </div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                    dari {formatCurrency(goal.target_amount)}
                  </p>
                </div>

                {/* Tambah dana */}
                {addingFunds === goal.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      value={fundAmount}
                      onChange={e => setFundAmount(e.target.value)}
                      placeholder="Jumlah (Rp)"
                      className="neu-input"
                      style={{ flex: 1, paddingTop: '8px', paddingBottom: '8px', fontSize: '14px' }}
                    />
                    <button onClick={() => handleAddFunds(goal)} className="neu-btn-primary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px' }}>Simpan</button>
                    <button onClick={() => { setAddingFunds(null); setFundAmount(''); }} className="neu-btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px' }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingFunds(goal.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px dashed #2B3440', background: '#f3fcef', cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, color: '#22C55E', width: '100%', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3fcef'}
                  >
                    <PlusCircle size={16} /> Tambah Dana
                  </button>
                )}

                {/* Edit & hapus */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditData(goal); setShowForm(true); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', border: '2px solid #2B3440', background: 'white', cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontSize: '13px', fontWeight: 600, boxShadow: '2px 2px 0px #2B3440', transition: 'all 0.1s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px,-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(goal.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', border: '2px solid #EF4444', background: 'white', cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontSize: '13px', fontWeight: 600, color: '#EF4444', boxShadow: '2px 2px 0px #EF4444', transition: 'all 0.1s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'none'; }}>
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
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