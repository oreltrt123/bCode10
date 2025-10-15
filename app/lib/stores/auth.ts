import { atom, computed } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/client';

export const userStore = atom<User | null>(null);
export const sessionStore = atom<Session | null>(null);
export const isAuthenticatedStore = computed(userStore, (user) => user !== null);
export const isLoadingAuthStore = atom<boolean>(true);

export function initAuth() {
  if (import.meta.env.SSR) {
    return;
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    sessionStore.set(session);
    userStore.set(session?.user ?? null);
    isLoadingAuthStore.set(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    (async () => {
      sessionStore.set(session);
      userStore.set(session?.user ?? null);
      isLoadingAuthStore.set(false);
    })();
  });

  return () => {
    subscription.unsubscribe();
  };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
