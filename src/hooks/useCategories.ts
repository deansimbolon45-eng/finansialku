'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types/database';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return {
    categories,
    incomeCategories: categories.filter(c => c.type === 'income'),
    expenseCategories: categories.filter(c => c.type === 'expense'),
    loading,
  };
}