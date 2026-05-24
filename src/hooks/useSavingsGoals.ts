'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SavingsGoal } from '@/types/database';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchGoals() {
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setGoals(data);
    setLoading(false);
  }

  useEffect(() => { fetchGoals(); }, []);

  async function addGoal(goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('savings_goals').insert({ ...goal, user_id: user.id });
    if (!error) fetchGoals();
    return error;
  }

  async function updateGoal(id: string, updates: Partial<SavingsGoal>) {
    const { error } = await supabase
      .from('savings_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) fetchGoals();
    return error;
  }

  async function deleteGoal(id: string) {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (!error) fetchGoals();
    return error;
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal, refetch: fetchGoals };
}