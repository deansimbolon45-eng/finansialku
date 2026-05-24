'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import { Loader2, Save, LogOut, Key, User } from 'lucide-react';

export default function PengaturanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) { setProfile(data); setFullName(data.full_name || ''); }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', profile!.id);
    setSaving(false);
    setMessage(error ? 'Gagal menyimpan!' : 'Profil berhasil disimpan! ✅');
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) { setPasswordMessage('Password minimal 6 karakter!'); return; }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    setPasswordMessage(error ? 'Gagal mengubah password!' : 'Password berhasil diubah! ✅');
    setNewPassword('');
    setTimeout(() => setPasswordMessage(''), 3000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-fredoka text-2xl font-bold text-[#2B3440]">Pengaturan ⚙️</h1>
        <p className="font-poppins text-sm text-[#9CA3AF]">Kelola profil dan preferensi akun</p>
      </div>

      <div className="neu-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#DCFCE7] rounded-[10px] border-2 border-[#2B3440] flex items-center justify-center">
            <User size={18} className="text-[#22C55E]" />
          </div>
          <h2 className="font-fredoka text-lg font-bold text-[#2B3440]">Profil Pengguna</h2>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full border-[3px] border-[#2B3440] bg-[#22C55E] flex items-center justify-center text-white font-fredoka font-bold text-2xl">
            {fullName.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-fredoka font-semibold text-[#2B3440]">{fullName || 'Pengguna'}</p>
            <p className="font-poppins text-sm text-[#9CA3AF]">Foto avatar dari inisial nama</p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-[10px] border-2 text-sm font-poppins ${message.includes('✅') ? 'bg-[#DCFCE7] border-[#22C55E] text-[#16A34A]' : 'bg-red-50 border-red-400 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Nama Lengkap</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama lengkap kamu" className="neu-input" />
          </div>
          <button type="submit" disabled={saving} className="neu-btn-primary">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      <div className="neu-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-blue-50 rounded-[10px] border-2 border-[#2B3440] flex items-center justify-center">
            <Key size={18} className="text-[#3B82F6]" />
          </div>
          <h2 className="font-fredoka text-lg font-bold text-[#2B3440]">Ganti Password</h2>
        </div>

        {passwordMessage && (
          <div className={`mb-4 p-3 rounded-[10px] border-2 text-sm font-poppins ${passwordMessage.includes('✅') ? 'bg-[#DCFCE7] border-[#22C55E] text-[#16A34A]' : 'bg-red-50 border-red-400 text-red-600'}`}>
            {passwordMessage}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-fredoka font-semibold text-[#2B3440] mb-1">Password Baru</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 6 karakter" className="neu-input" />
          </div>
          <button type="submit" disabled={changingPassword} className="neu-btn-primary">
            {changingPassword ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
            {changingPassword ? 'Mengubah...' : 'Ganti Password'}
          </button>
        </form>
      </div>

      <div className="neu-card p-5">
        <h2 className="font-fredoka text-lg font-bold text-[#EF4444] mb-3">⚠️ Zona Bahaya</h2>
        <p className="font-poppins text-sm text-[#6B7280] mb-4">Keluar dari akun Finansialku</p>
        <button onClick={handleLogout} className="neu-btn-danger">
          <LogOut size={18} /> Keluar dari Akun
        </button>
      </div>
    </div>
  );
}