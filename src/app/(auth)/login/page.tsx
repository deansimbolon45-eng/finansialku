'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email atau password salah. Coba lagi!');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FDFBF7' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 neu-card px-6 py-3 mb-4">
            <span className="text-3xl">💰</span>
            <h1 className="font-fredoka text-3xl font-bold text-[#2B3440]">Finansialku</h1>
          </div>
          <p className="text-[#6B7280] font-poppins">Kelola keuanganmu dengan lebih cerdas!</p>
        </div>

        <div className="neu-card p-8">
          <h2 className="font-fredoka text-2xl font-bold text-[#2B3440] mb-6">Masuk ke Akun</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded-[10px] text-red-600 text-sm font-poppins">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="neu-input"
              />
            </div>

            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="neu-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="neu-btn-primary w-full justify-center py-3 text-lg">
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Masuk...' : 'Masuk 🚀'}
            </button>
          </form>

          <p className="mt-6 text-center font-poppins text-[#6B7280] text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#22C55E] font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}