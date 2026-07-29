import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://khgisvxisqpbuuqzlsor.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ2lzdnhpc3FwYnV1cXpsc29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDI4MjMsImV4cCI6MjEwMDkxODgyM30.wVbSUvbDTUjMr_-ywWptOO05POlfgwR1aQYYTpXP-Xw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'atom_supabase_auth',
  },
});

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
