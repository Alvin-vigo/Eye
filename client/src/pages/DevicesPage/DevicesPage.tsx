import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Smartphone, Battery, Plus } from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import { Badge } from '@client/src/components/ui/badge';
import { Progress } from '@client/src/components/ui/progress';
import { devicesApi } from '@client/src/api';
import type { DeviceInfo } from '@shared/api.interface';

const DevicesPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [snCode, setSnCode] = useState<string>('');
  const [binding, setBinding] = useState<boolean>(false);
  const [bindError, setBindError] = useState<string>('');

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await devicesApi.getDevices();
      setDevices(result.items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`DevicesPage loadDevices failed: ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleBind = async () => {
    if (!snCode.trim()) {
      setBindError('请输入设备 SN 码');
      return;
    }
    try {
      setBinding(true);
      setBindError('');
      await devicesApi.bindDevice(snCode.trim());
      setSnCode('');
      await loadDevices();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`DevicesPage bindDevice failed: ${msg}`);
      setBindError(msg);
    } finally {
      setBinding(false);
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
        <h1 className="text-2xl font-bold text-foreground">我的设备</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理您的视在必行智能终端设备
        </p>
      </section>

      {/* 绑定新设备区域 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-label="绑定新设备"
      >
        <h2 className="text-lg font-semibold text-foreground">绑定新设备</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            placeholder="请输入设备 SN 码"
            value={snCode}
            onChange={(e) => setSnCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBind();
            }}
            aria-label="设备 SN 码"
          />
          <Button onClick={handleBind} disabled={binding}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {binding ? '绑定中...' : '绑定设备'}
          </Button>
        </div>
        {bindError && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {bindError}
          </p>
        )}
      </section>

      {/* 设备列表 */}
      <section aria-label="设备列表">
        <h2 className="text-lg font-semibold text-foreground">设备列表</h2>
        {devices.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-card p-10 text-center">
            <Smartphone
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-3 text-muted-foreground">
              暂无绑定设备，请先绑定您的设备
            </p>
          </div>
        ) : (
          <div
            className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2"
            data-ai-section-type="card-list"
          >
            {devices.map((device: DeviceInfo) => (
              <div
                key={device.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Smartphone className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {device.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SN：{device.snCode}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      device.connectionStatus === 'online'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    <span
                      className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                        device.connectionStatus === 'online'
                          ? 'bg-green-400'
                          : 'bg-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    {device.connectionStatus === 'online' ? '在线' : '离线'}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">固件版本</p>
                    <p className="text-sm font-medium text-foreground">
                      {device.firmwareVersion}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">最后同步</p>
                    <p className="text-sm font-medium text-foreground">
                      {device.lastSyncTime || '暂无'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Battery
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        电量
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {device.batteryLevel}%
                    </span>
                  </div>
                  <Progress value={device.batteryLevel} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    常规使用 ≥8 小时 / 待机 ≥48 小时
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default DevicesPage;
