'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, BarChart3, Settings } from 'lucide-react';
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
      <header className="h-16 border-b-4 border-[#2B3440] bg-white flex items-center justify-between px-4 md:px-6 overflow-visible">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-[10px] border-2 border-[#2B3440]">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="font-fredoka text-base md:text-lg font-bold text-[#2B3440]">Halo, {displayName}! 👋</h2>
            <p className="font-poppins text-xs text-[#6B7280] hidden sm:block">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 neu-card flex items-center justify-center hover:bg-[#DCFCE7] transition-colors">
            <Bell size={18} className="text-[#2B3440]" />
          </button>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 neu-card px-3 py-2 hover:bg-[#DCFCE7] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#22C55E] border-2 border-[#2B3440] flex items-center justify-center text-white font-fredoka font-bold text-sm">
                {initials}
              </div>
              <ChevronDown size={16} className="text-[#6B7280]" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 neu-card w-48 py-2 z-50 bg-white">
                <button onClick={() => { setDropdownOpen(false); router.push('/pengaturan'); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F3F4F6] font-poppins text-sm text-[#2B3440]">
                  <User size={16} /> Profil Saya
                </button>
                <hr className="my-1 border-[#E5E7EB]" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 font-poppins text-sm text-[#EF4444]">
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white border-r-4 border-[#2B3440] flex flex-col">
            <div className="p-4 border-b-4 border-[#2B3440] flex items-center justify-between">
              <h1 className="font-fredoka text-xl font-bold text-[#2B3440]">Finansialku</h1>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                  className={`nav-link ${pathname === href ? 'active' : ''}`}>
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
