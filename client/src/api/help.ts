import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface HelpCategory {
  code: string;
  name: string;
  description: string;
  icon: string;
}

export async function getFaqs(): Promise<{ items: FaqItem[] }> {
  const res = await axiosForBackend.get('/api/help/faqs');
  return res.data;
}

export async function getCategories(): Promise<{ items: HelpCategory[] }> {
  const res = await axiosForBackend.get('/api/help/categories');
  return res.data;
}
