import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import {
  AlertTriangle,
  Signal,
  DollarSign,
  User,
  Pill,
  Phone,
} from 'lucide-react';
import { Switch } from '@client/src/components/ui/switch';
import { Label } from '@client/src/components/ui/label';
import { settingsApi } from '@client/src/api';
import type { SettingsInfo } from '@shared/api.interface';

interface FeatureItem {
  key: keyof SettingsInfo;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
}

const FeaturesPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [settings, setSettings] = useState<SettingsInfo | null>(null);

  const featureList: FeatureItem[] = [
    {
      key: 'obstacleDetection',
      title: '障碍物检测',
      description: '实时检测前方障碍物并语音提醒',
      icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-warning/10',
      iconColorClass: 'text-warning',
    },
    {
      key: 'trafficLightAnnounce',
      title: '红绿灯播报',
      description: '识别路口红绿灯状态并播报',
      icon: <Signal className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-success/10',
      iconColorClass: 'text-success',
    },
    {
      key: 'currencyRecognition',
      title: '货币识别',
      description: '识别纸币面值并语音播报',
      icon: <DollarSign className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-info/10',
      iconColorClass: 'text-info',
    },
    {
      key: 'faceCapture',
      title: '人脸捕捉',
      description: '识别人脸并提醒姓名',
      icon: <User className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-primary/10',
      iconColorClass: 'text-primary',
    },
    {
      key: 'medicineRecognition',
      title: '药品辨认',
      description: '识别药品包装和说明',
      icon: <Pill className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-destructive/10',
      iconColorClass: 'text-destructive',
    },
    {
      key: 'sosEnabled',
      title: 'SOS 紧急求助',
      description: '一键发送求助信息给紧急联系人',
      icon: <Phone className="h-5 w-5" aria-hidden="true" />,
      iconBgClass: 'bg-destructive/10',
      iconColorClass: 'text-destructive',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await settingsApi.getSettings();
        if (!cancelled) setSettings(result.settings);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`FeaturesPage load failed: ${msg}`);
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (key: keyof SettingsInfo, checked: boolean) => {
    if (!settings) return;
    try {
      // 乐观更新
      setSettings({ ...settings, [key]: checked });
      const result = await settingsApi.updateSettings({
        [key]: checked,
      } as Partial<SettingsInfo>);
      setSettings(result.settings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`FeaturesPage toggle ${String(key)} failed: ${msg}`);
      // 回滚
      setSettings({ ...settings, [key]: !checked });
    }
  };

  if (loading) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-muted-foreground">加载中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-destructive">加载失败：{error}</p>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground">核心功能</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          开关配置终端的各项智能功能
        </p>
      </section>

      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        data-ai-section-type="card-list"
        aria-label="功能开关"
      >
        {featureList.map((feature) => {
          const isOn = Boolean(settings?.[feature.key]);
          return (
            <div
              key={feature.key}
              className="flex items-start justify-between rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.iconBgClass} ${feature.iconColorClass}`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Label htmlFor={`switch-${feature.key}`} className="sr-only">
                  {feature.title}
                </Label>
                <Switch
                  id={`switch-${feature.key}`}
                  checked={isOn}
                  onCheckedChange={(checked) =>
                    handleToggle(feature.key, checked)
                  }
                  aria-label={`切换${feature.title}`}
                />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default FeaturesPage;
