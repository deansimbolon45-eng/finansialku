'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Fade out setelah 2 detik
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 500);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#FDFBF7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          animation: 'bounceIn 0.6s ease',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '90px',
            height: '90px',
            background: '#22C55E',
            border: '4px solid #2B3440',
            borderRadius: '24px',
            boxShadow: '6px 6px 0px #2B3440',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            animation: 'pulse 1s infinite',
          }}
        >
          💰
        </div>

        {/* App name */}
        <h1
          style={{
            fontFamily: 'Fredoka',
            fontSize: '36px',
            fontWeight: 700,
            color: '#2B3440',
            margin: 0,
          }}
        >
          Finansialku
        </h1>

        <p
          style={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: '#6B7280',
            margin: 0,
          }}
        >
          Kelola keuanganmu dengan cerdas 🚀
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            height: '10px',
            background: '#E5E7EB',
            border: '2px solid #2B3440',
            borderRadius: '100px',
            overflow: 'hidden',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#22C55E',
              borderRadius: '100px',
              transition: 'width 0.03s linear',
            }}
          />
        </div>

        <p
          style={{
            fontFamily: 'Poppins',
            fontSize: '12px',
            color: '#9CA3AF',
            margin: 0,
          }}
        >
          Memuat... {progress}%
        </p>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}