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
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #22C55E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const initials = (fullName || profile?.full_name || 'U').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Pengaturan ⚙️</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Kelola akun dan preferensi kamu</p>
      </div>

      {/* Avatar & info */}
      <div className="neu-card" style={{ borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#22C55E', border: '2px solid #2B3440', boxShadow: '4px 4px 0px #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '28px', color: 'white', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>{fullName || 'User'}</h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{profile?.id || ''}</p>
          <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 12px', background: '#22C55E', border: '2px solid #2B3440', borderRadius: '9999px', fontFamily: 'Fredoka, sans-serif', fontSize: '12px', fontWeight: 600, color: 'white', boxShadow: '2px 2px 0px #2B3440' }}>
            Premium User ⭐
          </span>
        </div>
      </div>

      {/* Form profil */}
      <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="#22C55E" />
          </div>
          <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Profil Saya</h2>
        </div>
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Nama Lengkap</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama kamu" className="neu-input" />
          </div>
          {message && (
            <div style={{ padding: '12px 16px', background: message.includes('berhasil') ? '#DCFCE7' : '#ffd9df', border: '2px solid #2B3440', borderRadius: '12px', fontFamily: 'Fredoka, sans-serif', fontSize: '14px', color: '#2B3440' }}>
              {message}
            </div>
          )}
          <button type="submit" disabled={saving} className="neu-btn-primary" style={{ alignSelf: 'flex-start' }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* Ganti password */}
      <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#a5d8ff', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={18} color="#285f80" />
          </div>
          <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Ganti Password</h2>
        </div>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontWeight: 600, color: '#2B3440', marginBottom: '6px' }}>Password Baru</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className="neu-input" />
          </div>
          {passwordMessage && (
            <div style={{ padding: '12px 16px', background: passwordMessage.includes('berhasil') ? '#DCFCE7' : '#ffd9df', border: '2px solid #2B3440', borderRadius: '12px', fontFamily: 'Fredoka, sans-serif', fontSize: '14px', color: '#2B3440' }}>
              {passwordMessage}
            </div>
          )}
          <button type="submit" disabled={changingPassword} className="neu-btn-primary" style={{ alignSelf: 'flex-start' }}>
            {changingPassword ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
            {changingPassword ? 'Mengubah...' : 'Ganti Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="neu-card" style={{ borderRadius: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffd9df', border: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={18} color="#EF4444" />
          </div>
          <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#2B3440', margin: 0 }}>Keluar</h2>
        </div>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#9CA3AF', margin: '0 0 16px 0' }}>
          Kamu akan keluar dari akun Finansialku kamu.
        </p>
        <button onClick={handleLogout} className="neu-btn-danger" style={{ alignSelf: 'flex-start' }}>
          <LogOut size={18} /> Keluar dari Akun
        </button>
      </div>

    </div>
  );
}