import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Search,
  Settings,
  Zap,
  Accessibility,
  Smartphone,
  Wrench,
  Headphones,
} from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@client/src/components/ui/accordion';
import type { FaqItem, HelpCategory } from '@shared/api.interface';

const HELP_CATEGORIES: HelpCategory[] = [
  {
    code: 'device-setup',
    name: '设备设置',
    description: '了解设备的初始设置、网络连接和蓝牙配对等操作。',
    icon: 'settings',
  },
  {
    code: 'core-features',
    name: '核心功能',
    description: '探索障碍物检测、导航、货币识别等核心功能的使用方法。',
    icon: 'zap',
  },
  {
    code: 'accessibility',
    name: '无障碍设置',
    description: '自定义语音播报、震动反馈和屏幕显示等无障碍选项。',
    icon: 'accessibility',
  },
  {
    code: 'mobile-app',
    name: '移动应用',
    description: '了解如何在手机上配合使用视在必行移动应用。',
    icon: 'smartphone',
  },
  {
    code: 'troubleshooting',
    name: '故障排除',
    description: '查找常见问题的解决方案和设备自检方法。',
    icon: 'wrench',
  },
  {
    code: 'contact-support',
    name: '联系支持',
    description: '通过在线客服、电话或邮件联系我们的支持团队。',
    icon: 'headphones',
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'device-setup',
    question: '设备如何进行初始设置？',
    answer:
      '长按设备电源键 3 秒开机，听到"欢迎使用视在必行"语音提示后，打开手机蓝牙并启动视在必行移动 App，按照 App 引导完成网络连接、账号绑定和基础配置即可。整个过程约需 3-5 分钟，语音会全程引导操作。',
  },
  {
    id: 'faq-2',
    category: 'device-setup',
    question: '设备充电需要多久？续航如何？',
    answer:
      '设备使用 Type-C 接口充电，完全充满约需 2 小时。日常使用场景下（每天使用 4-6 小时），一次充满可续航约 2-3 天。待机模式下续航可达 7 天以上。建议电量低于 20% 时及时充电。',
  },
  {
    id: 'faq-3',
    category: 'privacy',
    question: '我的数据安全吗？如何保护隐私？',
    answer:
      '我们高度重视用户隐私。所有数据传输均采用端到端加密，设备本地仅存储必要的配置信息，个人数据存储在符合等保三级要求的云服务器上。您可以随时在设置中查看、导出或删除您的个人数据。我们不会向第三方出售或共享您的个人信息。',
  },
  {
    id: 'faq-4',
    category: 'device-setup',
    question: '如何升级设备固件？',
    answer:
      '设备固件会在连接 Wi-Fi 时自动检查更新，检测到新版本后会语音提示您是否升级。您也可以在移动 App 的"设备管理-固件更新"中手动检查和升级。升级过程中请勿关机，通常需要 5-10 分钟，升级完成后设备会自动重启。',
  },
  {
    id: 'faq-5',
    category: 'core-features',
    question: 'SOS 紧急求助如何使用？',
    answer:
      '长按设备侧面的 SOS 按钮 3 秒即可触发紧急求助。触发后设备会自动向您预设的紧急联系人发送当前位置信息，并启动语音通话。您可以在 App 中设置最多 3 位紧急联系人。建议首次使用前在 App 中完成紧急联系人配置和功能测试。',
  },
  {
    id: 'faq-6',
    category: 'core-features',
    question: '城市模式和乡村模式有什么区别？如何切换？',
    answer:
      '城市模式优化了对人行道、红绿灯、公交车站等城市场景的识别，障碍物检测灵敏度更高；乡村模式则降低了对草木等自然障碍物的误报，更适合开阔道路和乡村环境使用。您可以通过语音指令"切换城市模式"或"切换乡村模式"快速切换，也可以在 App 的"核心功能"设置中手动切换。',
  },
  {
    id: 'faq-7',
    category: 'core-features',
    question: '障碍物检测的有效距离是多少？',
    answer:
      '设备前方障碍物检测有效距离为 0.3 米至 8 米，可检测最小物体约 5 厘米。不同障碍物类型的检测距离略有差异：行人、车辆等大型障碍物最远 8 米，台阶、坑洞等地貌变化约 3 米。建议行走时保持正常步速，以便设备有充足时间播报预警。',
  },
  {
    id: 'faq-8',
    category: 'accessibility',
    question: '如何调整语音播报的语速和音量？',
    answer:
      '您可以通过语音指令"调快语速"、"调慢语速"或"音量增大"、"音量减小"来快速调整。也可以在 App 的"无障碍设置"中精确调节语速（0.8x / 1.0x / 1.2x 三档）和音量（0-100 连续调节）。语音音色支持男声和女声两种选择。',
  },
  {
    id: 'faq-9',
    category: 'troubleshooting',
    question: '设备无法开机怎么办？',
    answer:
      '首先确认设备电量，连接充电器充电 10 分钟后再尝试开机。如果仍无法开机，可长按电源键 15 秒强制重启。如问题持续，请联系客服进行硬件检测。保修期内非人为损坏可享受免费维修服务。',
  },
  {
    id: 'faq-10',
    category: 'troubleshooting',
    question: '语音播报没有声音怎么办？',
    answer:
      '请先检查设备是否处于静音模式（可通过语音指令"取消静音"恢复）。然后确认音量是否调至最低。若仍无声音，请在 App 中检查扬声器设置，或尝试重启设备。如确认是硬件问题，请联系售后支持。',
  },
];

const HOT_SEARCHES = ['设备设置', '核心功能', '无障碍设置'];

const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  settings: Settings,
  zap: Zap,
  accessibility: Accessibility,
  smartphone: Smartphone,
  wrench: Wrench,
  headphones: Headphones,
};

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!submittedQuery.trim()) return FAQ_ITEMS;
    const q = submittedQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter(
      (item: FaqItem) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [submittedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const handleHotSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setSubmittedQuery(keyword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex flex-col">
      <header className="w-full py-6 px-8 bg-white/70 backdrop-blur-sm border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Eye className="w-5 h-5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                视在必行 <span className="text-primary">VisionPilot</span>
              </h1>
              <p className="text-sm text-muted-foreground">智能助盲终端服务平台</p>
            </div>
          </Link>
          <nav aria-label="顶部导航">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  登录
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  注册
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-primary font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                  aria-current="page"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link
                  to="/help#about"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <section aria-labelledby="help-title" className="text-center mb-12">
            <h1 id="help-title" className="text-3xl font-bold text-foreground mb-4">
              帮助中心
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              查找常见问题的答案，了解视在必行智能助盲终端软件的各项功能。
            </p>
          </section>

          <section aria-labelledby="search-title" className="mb-16">
            <h2 id="search-title" className="sr-only">
              搜索帮助
            </h2>
            <form
              onSubmit={handleSearch}
              role="search"
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2 bg-white rounded-xl border border-border p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Search
                  className="w-5 h-5 text-muted-foreground ml-3 shrink-0"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="搜索常见问题..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                  aria-label="搜索常见问题"
                />
                <Button type="submit" size="default">
                  搜索
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm">
              <span className="text-muted-foreground">热门搜索：</span>
              {HOT_SEARCHES.map((keyword: string, index: number) => (
                <div key={keyword} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleHotSearch(keyword)}
                    className="text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                  >
                    {keyword}
                  </button>
                  {index < HOT_SEARCHES.length - 1 && (
                    <span className="text-border" aria-hidden="true">
                      |
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="quick-links-title" className="mb-16">
            <h2 id="quick-links-title" className="text-xl font-semibold mb-6">
              快速链接
            </h2>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
              data-ai-section-type="card-list"
            >
              {HELP_CATEGORIES.map((category: HelpCategory) => {
                const IconComponent = iconMap[category.icon] || Settings;
                return (
                  <Link
                    key={category.code}
                    to={`/help#${category.code}`}
                    className="bg-white rounded-xl p-6 border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 block"
                    aria-label={`${category.name}：${category.description}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                      <IconComponent
                        className="w-6 h-6 text-white"
                        aria-hidden
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="faq-title" className="mb-16">
            <h2 id="faq-title" className="text-xl font-semibold mb-6">
              常见问题
              {submittedQuery && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  （找到 {filteredFaqs.length} 条结果）
                </span>
              )}
            </h2>
            <div className="bg-white rounded-xl border border-border p-6">
              {filteredFaqs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  未找到相关问题，请尝试其他关键词。
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((item: FaqItem) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full py-6 px-8 border-t border-border/40 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 视在必行 VisionPilot. 保留所有权利。</p>
          <nav aria-label="底部链接">
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  帮助中心
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help#privacy"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  隐私政策
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help#terms"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  服务条款
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help#about"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HelpPage;
