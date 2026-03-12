import { supabase } from './supabase';
import type { User } from '../types/auth';

export async function signUp(username: string, password: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password_hash: password }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signIn(username: string, password: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password)
    .single();

  if (error) throw error;
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    localStorage.removeItem('userId');
    return null;
  }
  
  return data;
}

export function signOut(): void {
  localStorage.removeItem('userId');
}
