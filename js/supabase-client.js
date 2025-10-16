import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://waglahaoufmtvhkcfkog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZ2xhaGFvdWZtdHZoa2Nma29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjU3NjIsImV4cCI6MjA3NjIwMTc2Mn0.M1cjdZXHEpDTcKtzzRUfTqm-YLieHsRFqwpo71QojfE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
}

export async function requireAuth(redirectUrl = '/login.html') {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return null;
  }
  return user;
}

export async function requireRole(requiredRole, redirectUrl = '/login.html') {
  const user = await requireAuth(redirectUrl);
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== requiredRole) {
    window.location.href = redirectUrl;
    return null;
  }

  return { user, profile };
}
