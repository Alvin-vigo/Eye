import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import {
  Clock,
  AlertTriangle,
  Navigation,
  Battery,
  Smartphone,
  Cloud,
} from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
import { Progress } from '@client/src/components/ui/progress';
import { devicesApi } from '@client/src/api';
import type { DashboardOverview } from '@shared/api.interface';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await devicesApi.getOverview();
        if (!cancelled) setData(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`DashboardPage load failed: ${msg}`);
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

  const device = data?.device;
  const activeSubscription = data?.subscriptions?.find(
    (s) => s.status === 'active',
  );

  return (
    <main className="space-y-6 p-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground">总览</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看您的设备状态和使用概况
        </p>
      </section>

      {/* 统计卡片行 */}
      <section
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        data-ai-section-type="card-stat"
      >
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">今日使用时长</p>
              <p className="text-2xl font-bold text-foreground">
                {data?.todayUsageMinutes ?? 0} 分钟
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">环境感知预警</p>
              <p className="text-2xl font-bold text-foreground">
                {data?.todayWarnings ?? 0} 次
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Navigation className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">导航里程</p>
              <p className="text-2xl font-bold text-foreground">
                {(data?.totalNavigationKm ?? 0).toFixed(1)} 公里
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
              <Battery className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">设备电量</p>
              <p className="text-2xl font-bold text-foreground">
                {device?.batteryLevel ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 中部：设备状态 + 订阅状态 */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 设备状态 - 占 2/3 */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">我的设备</h2>
            {device && (
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
            )}
          </div>

          {device ? (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Smartphone className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{device.model}</p>
                  <p className="text-sm text-muted-foreground">
                    SN：{device.snCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">固件版本</p>
                  <p className="font-medium text-foreground">
                    {device.firmwareVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">最后同步</p>
                  <p className="font-medium text-foreground">
                    {device.lastSyncTime || '暂无同步记录'}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">电量</p>
                  <p className="text-sm font-medium text-foreground">
                    {device.batteryLevel}%
                  </p>
                </div>
                <Progress value={device.batteryLevel} />
                <p className="mt-2 text-xs text-muted-foreground">
                  常规使用约 8 小时
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center text-muted-foreground">
              暂无绑定设备
            </div>
          )}
        </div>

        {/* 订阅状态 - 占 1/3 */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">云端服务</h2>
          </div>

          {activeSubscription ? (
            <div className="mt-5 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">当前套餐</p>
                <p className="text-base font-semibold text-foreground">
                  {activeSubscription.planName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">状态</p>
                <Badge variant="default">有效</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">到期时间</p>
                <p className="font-medium text-foreground">
                  {activeSubscription.endDate}
                </p>
              </div>
              <Button variant="outline" className="mt-2 w-full">
                查看更多
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                您还没有订阅任何云端服务
              </p>
              <Button variant="default" className="w-full">
                立即订阅
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
