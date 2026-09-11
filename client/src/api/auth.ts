import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type { LoginRequest, LoginResponse, RegisterRequest, UserInfo } from '@shared/api.interface';

const TOKEN_KEY = 'vp_session_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosForBackend.post('/api/auth/login', data);
  return res.data;
}

export async function register(
  data: RegisterRequest,
): Promise<{ success: boolean; user: UserInfo; token: string }> {
  const res = await axiosForBackend.post('/api/auth/register', data);
  return res.data;
}

export async function logout(): Promise<{ success: boolean }> {
  const token = getToken();
  try {
    const res = await axiosForBackend.post(
      '/api/auth/logout',
      {},
      {
        headers: { 'x-session-token': token || '' },
      },
    );
    return res.data;
  } catch (err: unknown) {
    logger.error(`auth.logout failed: ${err instanceof Error ? err.message : String(err)}`);
    return { success: true };
  } finally {
    clearToken();
  }
}

export async function getCurrentUser(): Promise<{ user: UserInfo }> {
  const token = getToken();
  const res = await axiosForBackend.get('/api/auth/me', {
    headers: { 'x-session-token': token || '' },
  });
  return res.data;
}
