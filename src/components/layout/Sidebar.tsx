'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank,
  BarChart3, Settings, HelpCircle,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transaksi', icon: ArrowLeftRight, label: 'Transaksi' },
  { href: '/tabungan', icon: PiggyBank, label: 'Target Tabungan' },
  { href: '/laporan', icon: BarChart3, label: 'Laporan' },
  { href: '/pengaturan', icon: Settings, label: 'Pengaturan' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '256px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderRight: '2px solid #2B3440',
        padding: '32px 24px',
        flexShrink: 0,
      }}
    >
      {/* Logo teks besar hijau — sesuai stitch */}
      <div style={{ marginBottom: '48px' }}>
        <h1
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#22C55E',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Finansialku
        </h1>
      </div>

      {/* Navigasi */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer card — bg-tertiary-fixed (#ffd9df) sesuai stitch */}
      <div style={{ marginTop: 'auto' }}>
        <div
          className="neu-card"
          style={{ background: '#ffd9df', padding: '16px', borderRadius: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <HelpCircle size={16} color="#2B3440" />
            <p
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                color: '#2B3440',
                margin: 0,
              }}
            >
              Butuh Bantuan?
            </p>
          </div>
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '12px',
              color: '#2B3440',
              opacity: 0.8,
              margin: 0,
            }}
          >
            Hubungi tim support kami kapan saja.
          </p>
        </div>
      </div>
    </aside>
  );
}