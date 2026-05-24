import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FDFBF7', overflow: 'hidden' }}>
      <div className="sidebar-desktop">
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header profile={profile} user={user} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
