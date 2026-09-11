import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { getToken } from './auth';
import type { DeviceInfo, DashboardOverview } from '@shared/api.interface';

const authHeaders = () => ({ 'x-session-token': getToken() || '' });

export async function getDevices(): Promise<{ items: DeviceInfo[] }> {
  const res = await axiosForBackend.get('/api/devices', { headers: authHeaders() });
  return res.data;
}

export async function bindDevice(snCode: string): Promise<{ device: DeviceInfo }> {
  const res = await axiosForBackend.post(
    '/api/devices/bind',
    { snCode },
    { headers: authHeaders() },
  );
  return res.data;
}

export async function getOverview(): Promise<DashboardOverview & { subscriptions: any[] }> {
  const res = await axiosForBackend.get('/api/devices/overview', { headers: authHeaders() });
  return res.data;
}
