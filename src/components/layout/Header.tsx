'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import type { Profile } from '@/types/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  profile: Profile | null;
  user: SupabaseUser;
}

export default function Header({ profile, user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 border-b-4 border-[#2B3440] bg-white flex items-center justify-between px-6 overflow-visible">
      <div>
        <h2 className="font-fredoka text-lg font-bold text-[#2B3440]">
          Halo, {displayName}! 👋
        </h2>
        <p className="font-poppins text-xs text-[#6B7280]">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 neu-card flex items-center justify-center hover:bg-[#DCFCE7] transition-colors">
          <Bell size={18} className="text-[#2B3440]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 neu-card px-3 py-2 hover:bg-[#DCFCE7] transition-colors"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border-2 border-[#2B3440]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#22C55E] border-2 border-[#2B3440] flex items-center justify-center text-white font-fredoka font-bold text-sm">
                {initials}
              </div>
            )}
            <span className="font-fredoka font-semibold text-[#2B3440] text-sm hidden sm:block">
              {displayName}
            </span>
            <ChevronDown size={16} className="text-[#6B7280]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 neu-card w-48 py-2 z-50" style={{ right: 0, minWidth: '180px' }}>
              <button
                onClick={() => { setDropdownOpen(false); router.push('/pengaturan'); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F3F4F6] font-poppins text-sm text-[#2B3440]"
              >
                <User size={16} /> Profil Saya
              </button>
              <hr className="my-1 border-[#E5E7EB]" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 font-poppins text-sm text-[#EF4444]"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}