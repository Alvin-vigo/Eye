import { Injectable } from '@nestjs/common';
import type { FaqItem, HelpCategory } from '@shared/api.interface';

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-001',
    category: '设备设置',
    question: '如何绑定我的视在必行智能终端设备？',
    answer: '登录平台后，进入"我的设备"页面，点击"绑定新设备"按钮，输入设备背面的SN码即可完成绑定。每台设备只能绑定一个账号。',
  },
  {
    id: 'faq-002',
    category: '充电续航',
    question: '设备充满电需要多长时间？续航时间是多久？',
    answer: '设备使用标准Type-C充电器，约2小时可充满。正常使用情况下续航约8小时，待机模式下可达72小时。建议每晚充电以保证次日使用。',
  },
  {
    id: 'faq-003',
    category: '隐私安全',
    question: '我的使用数据和个人信息安全吗？',
    answer: '我们高度重视用户隐私。所有数据传输均采用端到端加密，语音和图像数据仅在设备本地处理，不会上传至云端。您可以随时在设置中管理数据权限。',
  },
  {
    id: 'faq-004',
    category: '固件升级',
    question: '如何升级设备固件？',
    answer: '设备会在连接Wi-Fi时自动检测并下载固件更新，您也可以在设备设置中手动检查更新。升级过程中请保持设备电量充足且不要关机。',
  },
  {
    id: 'faq-005',
    category: 'SOS求助',
    question: 'SOS紧急求助功能如何使用？',
    answer: '长按设备侧面的SOS按钮3秒即可触发紧急求助。系统会自动向预设的紧急联系人发送位置信息和求助通知。您可以在设置中配置紧急联系人和SOS功能开关。',
  },
  {
    id: 'faq-006',
    category: '城乡模式切换',
    question: '城市模式和乡村模式有什么区别？如何切换？',
    answer: '城市模式优化了红绿灯、人行横道、电梯等城市场景的识别精度；乡村模式增强了田间小路、坡道、障碍物复杂环境的导航能力。您可以在无障碍设置中手动切换，设备也支持根据定位自动切换。',
  },
  {
    id: 'faq-007',
    category: '障碍物检测',
    question: '障碍物检测能检测到哪些类型的障碍？',
    answer: '设备可以检测前方3米范围内的障碍物，包括行人、车辆、电线杆、台阶、低洼、悬空障碍物等。检测到障碍时会通过语音和震动双重提醒，提醒距离可在设置中调整。',
  },
  {
    id: 'faq-008',
    category: '语音播报',
    question: '如何调整语音播报的语速和音色？',
    answer: '进入"无障碍设置"页面，在语音设置区域可以调整语速（0.8x/1.0x/1.2x三档）和音色（男声/女声两种）。调整后立即生效，设备端和App端同步。',
  },
];

const HELP_CATEGORIES: HelpCategory[] = [
  {
    code: 'device-setup',
    name: '设备设置',
    description: '设备绑定、开机引导、基础配置',
    icon: 'smartphone',
  },
  {
    code: 'core-features',
    name: '核心功能',
    description: '障碍物检测、语音导航、红绿灯播报',
    icon: 'navigation',
  },
  {
    code: 'accessibility',
    name: '无障碍设置',
    description: '语音、震动、字号、对比度设置',
    icon: 'accessibility',
  },
  {
    code: 'mobile-app',
    name: '移动应用',
    description: 'App使用、账号管理、数据同步',
    icon: 'smartphone',
  },
  {
    code: 'troubleshooting',
    name: '故障排除',
    description: '常见问题排查、设备重置、固件恢复',
    icon: 'wrench',
  },
  {
    code: 'contact-support',
    name: '联系支持',
    description: '客服热线、在线咨询、反馈建议',
    icon: 'headphones',
  },
];

@Injectable()
export class HelpService {
  async getFaqs(): Promise<{ items: FaqItem[] }> {
    return { items: FAQ_ITEMS };
  }

  async getCategories(): Promise<{ items: HelpCategory[] }> {
    return { items: HELP_CATEGORIES };
  }
}
