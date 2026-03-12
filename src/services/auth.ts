import { supabase } from './supabase';
import type { User } from '../types/auth';

export async function signUp(username: string, password: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password_hash: password }])
    .select()
    .single();

  if (error) {
    console.error('Signup error:', error);
    throw new Error('Failed to create account');
  }
  return data;
}

export async function signIn(username: string, password: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password)
    .maybeSingle();

  if (error) {
    console.error('Signin error:', error);
    throw new Error('Login failed');
  }
  
  if (!data) {
    throw new Error('Invalid username or password');
  }
  
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('userId');
    return null;
  }
  
  return data;
}

export function signOut(): void {
  localStorage.removeItem('userId');
}
