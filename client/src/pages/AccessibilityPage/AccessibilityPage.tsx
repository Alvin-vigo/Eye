import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Volume2, Vibrate, Monitor, Save } from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Switch } from '@client/src/components/ui/switch';
import { Label } from '@client/src/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@client/src/components/ui/radio-group';
import { settingsApi } from '@client/src/api';
import type { SettingsInfo } from '@shared/api.interface';

const voiceSpeedOptions: { value: SettingsInfo['voiceSpeed']; label: string }[] = [
  { value: '0.8x', label: '0.8x' },
  { value: '1.0x', label: '1.0x' },
  { value: '1.2x', label: '1.2x' },
];

const voiceToneOptions: { value: SettingsInfo['voiceTone']; label: string }[] = [
  { value: 'male', label: '男声' },
  { value: 'female', label: '女声' },
];

const vibrationOptions: { value: number; label: string }[] = [
  { value: 1, label: '弱' },
  { value: 2, label: '中' },
  { value: 3, label: '强' },
];

const fontSizeOptions: { value: SettingsInfo['fontSize']; label: string }[] = [
  { value: 'large', label: '大' },
  { value: 'xlarge', label: '超大' },
];

const AccessibilityPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string>('');
  const [settings, setSettings] = useState<SettingsInfo | null>(null);

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
        logger.error(`AccessibilityPage load failed: ${msg}`);
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

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setSaveMsg('');
      await settingsApi.updateSettings(settings);
      setSaveMsg('设置已保存');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`AccessibilityPage save failed: ${msg}`);
      setSaveMsg(`保存失败：${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof SettingsInfo>(
    key: K,
    value: SettingsInfo[K],
  ) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
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
        <h1 className="text-2xl font-bold text-foreground">无障碍设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          根据您的需求自定义终端使用体验
        </p>
      </section>

      {/* 语音播报 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="voice-heading"
      >
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="voice-heading"
            className="text-lg font-semibold text-foreground"
          >
            语音播报
          </h2>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <Label className="mb-2 block text-sm font-medium text-foreground">
              语音播报语速
            </Label>
            <RadioGroup
              value={settings?.voiceSpeed}
              onValueChange={(val) =>
                updateField('voiceSpeed', val as SettingsInfo['voiceSpeed'])
              }
              className="flex flex-row gap-6"
              aria-label="语音播报语速"
            >
              {voiceSpeedOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`voice-speed-${opt.value}`}
                  />
                  <Label htmlFor={`voice-speed-${opt.value}`} className="cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-foreground">
              音色
            </Label>
            <RadioGroup
              value={settings?.voiceTone}
              onValueChange={(val) =>
                updateField('voiceTone', val as SettingsInfo['voiceTone'])
              }
              className="flex flex-row gap-6"
              aria-label="音色"
            >
              {voiceToneOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`voice-tone-${opt.value}`}
                  />
                  <Label htmlFor={`voice-tone-${opt.value}`} className="cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* 震动反馈 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="vibration-heading"
      >
        <div className="flex items-center gap-2">
          <Vibrate className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="vibration-heading"
            className="text-lg font-semibold text-foreground"
          >
            震动反馈
          </h2>
        </div>

        <div className="mt-5">
          <Label className="mb-2 block text-sm font-medium text-foreground">
            震动强度等级
          </Label>
          <RadioGroup
            value={String(settings?.vibrationLevel)}
            onValueChange={(val) =>
              updateField('vibrationLevel', Number(val))
            }
            className="flex flex-row gap-6"
            aria-label="震动强度等级"
          >
            {vibrationOptions.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={String(opt.value)}
                  id={`vibration-${opt.value}`}
                />
                <Label htmlFor={`vibration-${opt.value}`} className="cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </section>

      {/* 显示设置 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="display-heading"
      >
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="display-heading"
            className="text-lg font-semibold text-foreground"
          >
            显示设置
          </h2>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <Label className="mb-2 block text-sm font-medium text-foreground">
              屏幕字号
            </Label>
            <RadioGroup
              value={settings?.fontSize}
              onValueChange={(val) =>
                updateField('fontSize', val as SettingsInfo['fontSize'])
              }
              className="flex flex-row gap-6"
              aria-label="屏幕字号"
            >
              {fontSizeOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`font-size-${opt.value}`}
                  />
                  <Label htmlFor={`font-size-${opt.value}`} className="cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="high-contrast"
                className="text-sm font-medium text-foreground"
              >
                高对比度模式
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                增强界面元素的对比度
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings?.highContrast ?? false}
              onCheckedChange={(checked) =>
                updateField('highContrast', checked)
              }
              aria-label="高对比度模式"
            />
          </div>
        </div>
      </section>

      {/* 保存按钮 */}
      <section className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? '保存中...' : '保存设置'}
        </Button>
        {saveMsg && (
          <p
            className={`text-sm ${
              saveMsg.startsWith('保存失败')
                ? 'text-destructive'
                : 'text-success'
            }`}
            role="status"
          >
            {saveMsg}
          </p>
        )}
      </section>
    </main>
  );
};

export default AccessibilityPage;
