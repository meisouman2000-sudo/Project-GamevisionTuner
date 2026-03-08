import { BrowserWindow } from 'electron';
import { getSupabase } from './supabase';
import {
  AUTH_CALLBACK_URL,
  SUPABASE_URL,
  STRIPE_MONTHLY_PRICE_ID,
  STRIPE_YEARLY_PRICE_ID,
} from './config';

// ─── Types ───────────────────────────────────────────────────

export interface SubscriptionInfo {
  plan: 'free' | 'pro';
  status: string;       // 'active' | 'canceled' | 'past_due' | 'inactive'
  currentPeriodEnd: string | null;
}

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AuthState {
  loggedIn: boolean;
  user: AuthUser | null;
  subscription: SubscriptionInfo;
}

const FREE_GAME_LIMIT = 1;

// ─── Auth ────────────────────────────────────────────────────

export async function getAuthState(): Promise<AuthState> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return {
      loggedIn: false,
      user: null,
      subscription: { plan: 'free', status: 'inactive', currentPeriodEnd: null },
    };
  }

  const user: AuthUser = {
    id: session.user.id,
    email: session.user.email ?? null,
    displayName: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null,
    avatarUrl: session.user.user_metadata?.avatar_url ?? null,
  };

  const sub = await fetchSubscription(session.user.id);

  return { loggedIn: true, user, subscription: sub };
}

export function getGameLimit(plan: 'free' | 'pro'): number {
  return plan === 'pro' ? Infinity : FREE_GAME_LIMIT;
}

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: AUTH_CALLBACK_URL,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return { success: false, error: error?.message ?? 'Failed to generate auth URL' };
  }

  return openAuthWindow(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}

// ─── Subscription DB ─────────────────────────────────────────

async function fetchSubscription(userId: string): Promise<SubscriptionInfo> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { plan: 'free', status: 'inactive', currentPeriodEnd: null };
  }

  return {
    plan: data.status === 'active' ? 'pro' : 'free',
    status: data.status,
    currentPeriodEnd: data.current_period_end,
  };
}

// ─── Stripe Checkout ─────────────────────────────────────────

export async function createCheckoutSession(
  interval: 'month' | 'year'
): Promise<{ url: string | null; error?: string }> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { url: null, error: 'Not logged in' };
  }

  const priceId = interval === 'month'
    ? STRIPE_MONTHLY_PRICE_ID
    : STRIPE_YEARLY_PRICE_ID;

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { priceId },
  });

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data?.url ?? null };
}

export async function createPortalSession(): Promise<{ url: string | null; error?: string }> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { url: null, error: 'Not logged in' };
  }

  const { data, error } = await supabase.functions.invoke('create-portal', {
    body: {},
  });

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data?.url ?? null };
}

// ─── OAuth BrowserWindow ─────────────────────────────────────

function openAuthWindow(authUrl: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const authWindow = new BrowserWindow({
      width: 520,
      height: 700,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    authWindow.setMenuBarVisibility(false);
    let resolved = false;

    const handleUrl = async (url: string) => {
      if (resolved) return;
      if (!url.startsWith(AUTH_CALLBACK_URL)) return;

      resolved = true;

      try {
        const urlObj = new URL(url);

        // PKCE flow: code in query params
        const code = urlObj.searchParams.get('code');
        if (code) {
          const supabase = getSupabase();
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          authWindow.close();
          resolve({ success: !error, error: error?.message });
          return;
        }

        // Implicit flow fallback: tokens in hash
        const hashParams = new URLSearchParams(urlObj.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const supabase = getSupabase();
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          authWindow.close();
          resolve({ success: true });
          return;
        }

        authWindow.close();
        resolve({ success: false, error: 'No auth code found in callback' });
      } catch (e: any) {
        authWindow.close();
        resolve({ success: false, error: e.message });
      }
    };

    // Intercept all navigation events to catch the callback
    authWindow.webContents.on('will-navigate', (_e, url) => handleUrl(url));
    authWindow.webContents.on('will-redirect', (_e, url) => handleUrl(url));
    authWindow.webContents.on('did-navigate', (_e, url) => handleUrl(url));

    authWindow.on('closed', () => {
      if (!resolved) {
        resolved = true;
        resolve({ success: false, error: 'Auth window closed by user' });
      }
    });

    authWindow.loadURL(authUrl);
  });
}
