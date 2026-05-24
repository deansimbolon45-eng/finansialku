'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FDFBF7' }}>
        <div className="neu-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-fredoka text-2xl font-bold text-[#2B3440] mb-2">Berhasil Daftar!</h2>
          <p className="font-poppins text-[#6B7280] mb-6">Cek email kamu untuk verifikasi akun ya!</p>
          <Link href="/login" className="neu-btn-primary">Ke Halaman Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FDFBF7' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 neu-card px-6 py-3 mb-4">
            <span className="text-3xl">💰</span>
            <h1 className="font-fredoka text-3xl font-bold text-[#2B3440]">Finansialku</h1>
          </div>
          <p className="text-[#6B7280] font-poppins">Mulai perjalanan finansialmu hari ini!</p>
        </div>

        <div className="neu-card p-8">
          <h2 className="font-fredoka text-2xl font-bold text-[#2B3440] mb-6">Buat Akun Baru</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded-[10px] text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">Nama Lengkap</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama kamu" required className="neu-input" />
            </div>
            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required className="neu-input" />
            </div>
            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  required
                  className="neu-input pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="neu-btn-primary w-full justify-center py-3 text-lg">
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Mendaftar...' : 'Daftar Sekarang ✨'}
            </button>
          </form>

          <p className="mt-6 text-center font-poppins text-[#6B7280] text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#22C55E] font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}