'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Bell, LogOut, User, ChevronDown,
  Menu, X, LayoutDashboard, ArrowLeftRight,
  PiggyBank, BarChart3, Settings,
} from 'lucide-react';
import Link from 'next/link';
import type { Profile } from '@/types/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transaksi', icon: ArrowLeftRight, label: 'Transaksi' },
  { href: '/tabungan', icon: PiggyBank, label: 'Target Tabungan' },
  { href: '/laporan', icon: BarChart3, label: 'Laporan' },
  { href: '/pengaturan', icon: Settings, label: 'Pengaturan' },
];

interface HeaderProps {
  profile: Profile | null;
  user: SupabaseUser;
}

export default function Header({ profile, user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header
        style={{
          height: '64px',
          borderBottom: '2px solid #2B3440',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Kiri: hamburger + judul */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #2B3440', borderRadius: '10px',
              background: 'white', cursor: 'pointer',
              boxShadow: '2px 2px 0px #2B3440',
            }}
          >
            <Menu size={20} />
          </button>
          <div>
            <h2
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1.75rem', fontWeight: 700,
                color: '#2B3440', margin: 0, lineHeight: 1.2,
              }}
            >
              Dashboard
            </h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px', color: '#4B5563', margin: 0 }}>
              Selamat datang kembali, {displayName}!
            </p>
          </div>
        </div>

        {/* Kanan: bell + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="neu-card"
            style={{
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: '#FFFFFF', cursor: 'pointer',
            }}
          >
            <Bell size={18} />
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div
                className="neu-card"
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '16px',
                }}
              >
                {initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '14px', fontWeight: 600, color: '#2B3440', margin: 0, lineHeight: 1.2 }}>
                  {displayName}
                </p>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '11px', color: '#4B5563', margin: 0 }}>
                  Premium User
                </p>
              </div>
              <ChevronDown size={16} color="#6B7280" />
            </button>

            {dropdownOpen && (
              <div
                className="neu-card"
                style={{ position: 'absolute', right: 0, top: '52px', width: '180px', padding: '8px 0', background: 'white', zIndex: 100, borderRadius: '12px' }}
              >
                <button
                  onClick={() => { setDropdownOpen(false); router.push('/pengaturan'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#2B3440' }}
                >
                  <User size={16} /> Profil Saya
                </button>
                <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #E5E7EB' }} />
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', color: '#EF4444' }}
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '260px', background: 'white', borderRight: '2px solid #2B3440', display: 'flex', flexDirection: 'column', zIndex: 10000 }}>
            <div style={{ padding: '24px', borderBottom: '2px solid #2B3440', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#22C55E', margin: 0 }}>Finansialku</h1>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={`nav-link ${pathname === href ? 'active' : ''}`}>
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}