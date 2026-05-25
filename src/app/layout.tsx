import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Finansialku - Personal Finance Dashboard',
  description: 'Kelola keuanganmu dengan lebih cerdas dan menyenangkan!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Poppins, sans-serif',
              border: '3px solid #2B3440',
              borderRadius: '10px',
              boxShadow: '4px 4px 0px #2B3440',
            },
          }}
        />
      </body>
    </html>
  );
}