'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank,
  BarChart3, Settings, TrendingUp,
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
    <aside className="w-64 h-full flex flex-col border-r-4 border-[#2B3440] bg-white">
      <div className="p-6 border-b-4 border-[#2B3440]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22C55E] rounded-neu-sm border-3 border-[#2B3440] flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <h1 className="font-fredoka text-xl font-bold text-[#2B3440]">Finansialku</h1>
            <p className="text-xs text-[#6B7280] font-poppins">Personal Finance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="font-fredoka text-xs text-[#9CA3AF] uppercase tracking-wider mb-3 px-2">
          Menu Utama
        </p>
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

      <div className="p-4 border-t-4 border-[#2B3440]">
        <div className="neu-card p-3 bg-[#DCFCE7]">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#22C55E]" />
            <div>
              <p className="font-fredoka text-sm font-semibold text-[#2B3440]">Tip Keuangan</p>
              <p className="font-poppins text-xs text-[#6B7280]">Hemat 20% dari penghasilan!</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}