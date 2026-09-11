import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { getToken } from './auth';
import type { SettingsInfo } from '@shared/api.interface';

const authHeaders = () => ({ 'x-session-token': getToken() || '' });

export async function getSettings(): Promise<{ settings: SettingsInfo }> {
  const res = await axiosForBackend.get('/api/settings', { headers: authHeaders() });
  return res.data;
}

export async function updateSettings(
  patch: Partial<SettingsInfo>,
): Promise<{ settings: SettingsInfo }> {
  const res = await axiosForBackend.patch('/api/settings', patch, { headers: authHeaders() });
  return res.data;
}
