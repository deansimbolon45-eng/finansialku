'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import LoadingScreen from '@/app/loading-screen/LoadingScreen';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return <LoadingScreen onFinish={() => setIsLoading(false)} />;

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

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FDFBF7' }}>
      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full border-4 border-[#2B3440] opacity-5" />
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full border-4 border-[#22C55E] opacity-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 neu-card px-6 py-3 mb-4">
            <span className="text-3xl">💰</span>
            <h1 className="font-fredoka text-3xl font-bold text-[#2B3440]">Finansialku</h1>
          </div>
          <p className="text-[#6B7280] font-poppins">Kelola keuanganmu dengan lebih cerdas!</p>
        </div>

        {/* Card */}
        <div className="neu-card p-8">
          <h2 className="font-fredoka text-2xl font-bold text-[#2B3440] mb-6">Masuk ke Akun</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded-[10px] text-red-600 text-sm font-poppins">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">
                Email
              </label>
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
              <label className="block font-fredoka text-[#2B3440] mb-2 font-semibold">
                Password
              </label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2B3440]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neu-btn-primary w-full justify-center py-3 text-lg"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Masuk...' : 'Masuk 🚀'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <hr className="flex-1 border-[#2B3440] border-t-2" />
            <span className="font-fredoka text-[#6B7280]">atau</span>
            <hr className="flex-1 border-[#2B3440] border-t-2" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="neu-btn-secondary w-full justify-center py-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

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