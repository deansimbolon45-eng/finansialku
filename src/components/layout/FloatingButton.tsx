'use client';

import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button onClick={onClick} className="floating-btn" title="Tambah Transaksi">
      <Plus size={28} className="text-white" strokeWidth={3} />
    </button>
  );
}