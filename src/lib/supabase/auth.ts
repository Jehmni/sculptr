import { createClient } from '@supabase/supabase-js';

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not set.');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function signUp(email: string, password: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  return { data };
}

export async function signIn(email: string, password: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

export async function signOut() {
  const supabase = createServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { success: true };
}

export async function getSession() {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return { error: error.message };
  return { data };
}

export async function getUser() {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { error: error.message };
  return { user };
}