import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Finansialku',
  description: 'Kelola keuanganmu dengan lebih cerdas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
