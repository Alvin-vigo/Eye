/* 视在必行 VisionPilot 平台 前后端共享类型定义 */

export interface UserInfo {
  id: string;
  account: string;
  nickname: string | null;
  phone: string | null;
  email: string | null;
}

export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResponse {
  user: UserInfo;
  token: string;
}

export interface RegisterRequest {
  account: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
}

export interface DeviceInfo {
  id: string;
  snCode: string;
  model: string;
  firmwareVersion: string;
  connectionStatus: 'online' | 'offline';
  batteryLevel: number;
  lastSyncTime: string | null;
  todayUsageMinutes: number;
  todayWarnings: number;
  totalNavigationKm: number;
}

export interface SubscriptionInfo {
  id: string;
  planCode: string;
  planName: string;
  price: number;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
}

export interface SettingsInfo {
  voiceSpeed: '0.8x' | '1.0x' | '1.2x';
  voiceTone: 'male' | 'female';
  vibrationLevel: number;
  fontSize: 'large' | 'xlarge';
  highContrast: boolean;
  obstacleDetection: boolean;
  trafficLightAnnounce: boolean;
  currencyRecognition: boolean;
  faceCapture: boolean;
  medicineRecognition: boolean;
  sosEnabled: boolean;
}

export interface DashboardOverview {
  device: DeviceInfo | null;
  todayUsageMinutes: number;
  todayWarnings: number;
  totalNavigationKm: number;
  subscriptions: SubscriptionInfo[];
}

export interface PlanInfo {
  code: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

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
