'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Transaction } from '@/types/database';

interface Filters {
  type?: 'income' | 'expense' | 'all';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useTransactions(filters?: Filters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters?.search) {
      query = query.ilike('description', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (!error && data) setTransactions(data as Transaction[]);
    setLoading(false);
  }, [filters?.type, filters?.categoryId, filters?.startDate, filters?.endDate, filters?.search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function addTransaction(tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id });
    if (!error) fetchTransactions();
    return error;
  }

  async function updateTransaction(id: string, tx: Partial<Transaction>) {
    const { error } = await supabase
      .from('transactions')
      .update({ ...tx, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) fetchTransactions();
    return error;
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (!error) fetchTransactions();
    return error;
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    loading,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}