import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://khgisvxisqpbuuqzlsoq.supabase.co';
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

// ── Projects CRUD ──
export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  client_name: string;
  industry: string;
  objective: string;
  description: string;
  author: string;
  nodes: any[];
  edges: any[];
  created_at: string;
  updated_at: string;
}

export async function fetchProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveProject(project: Partial<ProjectRow> & { nodes: any[]; edges: any[] }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    user_id: user.id,
    name: project.name || 'Nuevo Proyecto',
    client_name: project.client_name || '',
    industry: project.industry || '',
    objective: project.objective || '',
    description: project.description || '',
    author: project.author || user.email || '',
    nodes: project.nodes,
    edges: project.edges,
    updated_at: new Date().toISOString(),
  };

  if (project.id) {
    const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
    if (error) throw error;
    return project.id;
  } else {
    const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
    if (error) throw error;
    return data.id;
  }
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
