import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { getToken } from './auth';
import type { SubscriptionInfo, PlanInfo } from '@shared/api.interface';

const authHeaders = () => ({ 'x-session-token': getToken() || '' });

export async function getSubscriptions(): Promise<{ items: SubscriptionInfo[] }> {
  const res = await axiosForBackend.get('/api/subscriptions', { headers: authHeaders() });
  return res.data;
}

export async function getPlans(): Promise<{ items: PlanInfo[] }> {
  const res = await axiosForBackend.get('/api/subscriptions/plans', { headers: authHeaders() });
  return res.data;
}
