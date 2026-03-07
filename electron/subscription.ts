import Store from 'electron-store';
import { net } from 'electron';

const store = new Store();

// LP側のAPIエンドポイント（デプロイ後に差し替え）
const VALIDATION_API_URL = 'https://your-domain.com/api/validate-license';

export interface SubscriptionStatus {
  active: boolean;
  licenseKey: string | null;
  plan: 'free' | 'pro';
  expiresAt: string | null;
  lastValidated: string | null;
}

const FREE_GAME_LIMIT = 1;

export function getSubscriptionStatus(): SubscriptionStatus {
  return store.get('subscription', {
    active: false,
    licenseKey: null,
    plan: 'free',
    expiresAt: null,
    lastValidated: null,
  }) as SubscriptionStatus;
}

export function getFreeGameLimit(): number {
  return FREE_GAME_LIMIT;
}

export function getGameLimit(): number {
  const sub = getSubscriptionStatus();
  return sub.active ? Infinity : FREE_GAME_LIMIT;
}

export async function activateLicense(licenseKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await validateLicenseOnline(licenseKey);

    if (result.valid) {
      const status: SubscriptionStatus = {
        active: true,
        licenseKey,
        plan: 'pro',
        expiresAt: result.expiresAt || null,
        lastValidated: new Date().toISOString(),
      };
      store.set('subscription', status);
      return { success: true };
    }

    return { success: false, error: result.error || 'Invalid license key' };
  } catch (e) {
    // オフラインフォールバック: APIに接続できない場合はローカルフォーマット検証
    if (isValidKeyFormat(licenseKey)) {
      const status: SubscriptionStatus = {
        active: true,
        licenseKey,
        plan: 'pro',
        expiresAt: null,
        lastValidated: new Date().toISOString(),
      };
      store.set('subscription', status);
      return { success: true };
    }
    return { success: false, error: 'Could not validate license. Check your internet connection.' };
  }
}

export function deactivateLicense(): void {
  store.set('subscription', {
    active: false,
    licenseKey: null,
    plan: 'free',
    expiresAt: null,
    lastValidated: null,
  });
}

/**
 * 定期的にライセンスの有効性を再検証する（アプリ起動時に呼び出し推奨）
 */
export async function revalidateIfNeeded(): Promise<void> {
  const sub = getSubscriptionStatus();
  if (!sub.active || !sub.licenseKey) return;

  const lastCheck = sub.lastValidated ? new Date(sub.lastValidated) : new Date(0);
  const hoursSinceCheck = (Date.now() - lastCheck.getTime()) / (1000 * 60 * 60);

  // 24時間以上経過していたら再検証
  if (hoursSinceCheck < 24) return;

  try {
    const result = await validateLicenseOnline(sub.licenseKey);
    if (result.valid) {
      store.set('subscription.lastValidated', new Date().toISOString());
      if (result.expiresAt) {
        store.set('subscription.expiresAt', result.expiresAt);
      }
    } else {
      deactivateLicense();
    }
  } catch {
    // ネットワークエラー時は猶予を与える（既存のステータスを維持）
  }
}

// --- Internal helpers ---

function isValidKeyFormat(key: string): boolean {
  // GVT-XXXX-XXXX-XXXX-XXXX 形式を検証
  return /^GVT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key);
}

async function validateLicenseOnline(
  licenseKey: string
): Promise<{ valid: boolean; expiresAt?: string; error?: string }> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ licenseKey });

    const request = net.request({
      method: 'POST',
      url: VALIDATION_API_URL,
    });

    request.setHeader('Content-Type', 'application/json');

    let body = '';

    request.on('response', (response) => {
      response.on('data', (chunk) => {
        body += chunk.toString();
      });
      response.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({
            valid: data.valid === true,
            expiresAt: data.expiresAt,
            error: data.error,
          });
        } catch {
          resolve({ valid: false, error: 'Invalid server response' });
        }
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.write(postData);
    request.end();
  });
}
