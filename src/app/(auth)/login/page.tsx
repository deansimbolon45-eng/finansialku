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
  const [hoverCard, setHoverCard] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const [hoverStat1, setHoverStat1] = useState(false);
  const [hoverStat2, setHoverStat2] = useState(false);
  const [hoverStat3, setHoverStat3] = useState(false);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFBF7',
      fontFamily: 'Poppins, sans-serif',
    }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-wrapper {
          display: flex;
          min-height: 100vh;
        }

        /* Hero kiri — hanya tampil di desktop */
        .hero-section {
          display: none;
        }

        /* Form kanan — full width di mobile */
        .form-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 24px;
          background: #FDFBF7;
          animation: fadeInUp 0.6s ease;
        }

        /* Desktop: tampilkan hero kiri */
        @media (min-width: 768px) {
          .hero-section {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 60px;
            background: #22C55E;
            position: relative;
            overflow: hidden;
            animation: fadeInLeft 0.6s ease;
          }
          .form-section {
            width: 480px;
            flex-shrink: 0;
            padding: 48px 40px;
            animation: fadeInRight 0.6s ease;
          }
          .mobile-logo {
            display: none !important;
          }
        }
      `}</style>

      <div className="login-wrapper">

        {/* ===== KIRI: Hero Section (desktop only) ===== */}
        <div className="hero-section">

          {/* Dekorasi */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '300px', height: '300px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.2)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '-40px',
            width: '200px', height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.2)',
          }} />
          <div style={{
            position: 'absolute', bottom: '120px', right: '40px',
            width: '100px', height: '100px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '24px',
            border: '3px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
            animation: 'float 3s ease-in-out infinite',
          }}>
            📈
          </div>

          {/* Logo */}
          <div
            onMouseEnter={() => setHoverLogo(true)}
            onMouseLeave={() => setHoverLogo(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              background: 'white',
              border: '3px solid #2B3440',
              borderRadius: '16px',
              padding: '10px 20px',
              boxShadow: hoverLogo ? '6px 6px 0px #2B3440' : '4px 4px 0px #2B3440',
              marginBottom: '48px',
              transform: hoverLogo ? 'translate(-2px, -2px)' : 'translate(0,0)',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '28px' }}>💰</span>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '24px', color: '#2B3440' }}>
              Finansialku
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Fredoka',
            fontSize: '52px',
            fontWeight: 700,
            color: '#2B3440',
            lineHeight: 1.1,
            margin: '0 0 16px 0',
          }}>
            Kelola Uang,<br />
            <span style={{ color: 'white' }}>Raih Impian,</span><br />
            Hidup Tenang!
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#2B3440',
            opacity: 0.85,
            margin: '0 0 40px 0',
            lineHeight: 1.6,
            maxWidth: '360px',
          }}>
            Catat pemasukan & pengeluaran, buat target tabungan, dan lihat laporan keuanganmu dengan mudah.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            {[
              { num: '10K+', label: 'Pengguna Aktif', hover: hoverStat1, setHover: setHoverStat1 },
              { num: '500+', label: 'Transaksi/Hari', hover: hoverStat2, setHover: setHoverStat2 },
              { num: '98%', label: 'Kepuasan', hover: hoverStat3, setHover: setHoverStat3 },
            ].map(stat => (
              <div
                key={stat.label}
                onMouseEnter={() => stat.setHover(true)}
                onMouseLeave={() => stat.setHover(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  transform: stat.hover ? 'translate(-2px, -2px)' : 'translate(0,0)',
                  boxShadow: stat.hover ? '4px 4px 0px rgba(43,52,64,0.3)' : '2px 2px 0px rgba(43,52,64,0.2)',
                  transition: 'all 0.15s ease',
                  cursor: 'default',
                }}
              >
                <p style={{ fontFamily: 'Fredoka', fontSize: '26px', fontWeight: 700, color: 'white', margin: 0 }}>
                  {stat.num}
                </p>
                <p style={{ fontSize: '12px', color: '#2B3440', opacity: 0.9, margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Preview Card */}
          <div
            onMouseEnter={() => setHoverCard(true)}
            onMouseLeave={() => setHoverCard(false)}
            style={{
              background: 'white',
              border: '3px solid #2B3440',
              borderRadius: '20px',
              boxShadow: hoverCard ? '8px 8px 0px #2B3440' : '6px 6px 0px #2B3440',
              padding: '20px 24px',
              width: '100%',
              maxWidth: '380px',
              transform: hoverCard ? 'translate(-3px, -3px)' : 'translate(0,0)',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '44px', height: '44px',
                background: '#DCFCE7',
                borderRadius: '12px',
                border: '2px solid #2B3440',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
              }}>💳</div>
              <div>
                <p style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '16px', color: '#2B3440', margin: 0 }}>
                  Saldo Bulan Ini
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Update otomatis</p>
              </div>
            </div>
            <p style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '28px', color: '#22C55E', margin: '0 0 12px 0' }}>
              Rp 5.250.000
            </p>
            <div style={{
              height: '10px',
              background: '#F3F4F6',
              border: '2px solid #2B3440',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '72%', height: '100%',
                background: '#22C55E',
                borderRadius: '100px',
              }} />
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0 0' }}>
              72% dari target bulanan
            </p>
          </div>
        </div>

        {/* ===== KANAN: Form Login ===== */}
        <div className="form-section">

          {/* Logo — tampil di mobile saja */}
          <div
            className="mobile-logo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '3px solid #2B3440',
              borderRadius: '16px',
              padding: '10px 16px',
              boxShadow: '4px 4px 0px #2B3440',
              width: 'fit-content',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '24px' }}>💰</span>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '20px', color: '#2B3440' }}>
              Finansialku
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Fredoka',
            fontSize: '32px',
            fontWeight: 700,
            color: '#2B3440',
            margin: '0 0 8px 0',
          }}>
            Selamat Datang! 👋
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 32px 0' }}>
            Masuk ke akun Finansialku kamu
          </p>

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: '#FEF2F2',
              border: '2px solid #EF4444',
              borderRadius: '10px',
              color: '#EF4444',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Fredoka',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2B3440',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '3px solid #2B3440',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: 'Poppins',
                  outline: 'none',
                  background: 'white',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease',
                }}
                onFocus={e => {
                  e.target.style.boxShadow = '3px 3px 0px #22C55E';
                  e.target.style.borderColor = '#22C55E';
                  e.target.style.transform = 'translate(-1px, -1px)';
                }}
                onBlur={e => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = '#2B3440';
                  e.target.style.transform = 'translate(0,0)';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Fredoka',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2B3440',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    border: '3px solid #2B3440',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: 'Poppins',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                  }}
                  onFocus={e => {
                    e.target.style.boxShadow = '3px 3px 0px #22C55E';
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.transform = 'translate(-1px, -1px)';
                  }}
                  onBlur={e => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#2B3440';
                    e.target.style.transform = 'translate(0,0)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#22C55E',
                color: 'white',
                border: '3px solid #2B3440',
                borderRadius: '12px',
                boxShadow: hoverBtn ? '6px 6px 0px #2B3440' : '4px 4px 0px #2B3440',
                fontFamily: 'Fredoka',
                fontWeight: 700,
                fontSize: '18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transform: hoverBtn ? 'translate(-2px, -2px)' : 'translate(0,0)',
                transition: 'all 0.15s ease',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Masuk...' : 'Masuk ke Akun 🚀'}
            </button>
          </form>

          <p style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
          }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{
              color: '#22C55E',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Fredoka',
              fontSize: '15px',
            }}>
              Daftar Sekarang →
            </Link>
          </p>

          <p style={{
            marginTop: '48px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9CA3AF',
          }}>
            🔒 Data kamu aman & terenkripsi
          </p>
        </div>
      </div>
    </div>
  );
}