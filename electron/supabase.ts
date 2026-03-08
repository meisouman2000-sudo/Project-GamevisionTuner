import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Store from 'electron-store';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

const store = new Store();

const STORAGE_PREFIX = 'supabase_auth.';

const electronStorage = {
  getItem: (key: string): string | null => {
    return (store.get(`${STORAGE_PREFIX}${key}`) as string) ?? null;
  },
  setItem: (key: string, value: string): void => {
    store.set(`${STORAGE_PREFIX}${key}`, value);
  },
  removeItem: (key: string): void => {
    store.delete(`${STORAGE_PREFIX}${key}` as any);
  },
};

let supabase: SupabaseClient;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: electronStorage,
        autoRefreshToken: true,
        persistSession: true,
        flowType: 'pkce',
      },
    });
  }
  return supabase;
}
