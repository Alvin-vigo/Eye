import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Cloud, Check, Calendar, Package } from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
import { subscriptionsApi } from '@client/src/api';
import type { PlanInfo, SubscriptionInfo } from '@shared/api.interface';

const CloudPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [plans, setPlans] = useState<PlanInfo[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [subsRes, plansRes] = await Promise.all([
          subscriptionsApi.getSubscriptions(),
          subscriptionsApi.getPlans(),
        ]);
        if (!cancelled) {
          setSubscriptions(subsRes.items);
          setPlans(plansRes.items);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`CloudPage load failed: ${msg}`);
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

  const isSubscribed = (planCode: string): boolean => {
    return subscriptions.some(
      (s) => s.planCode === planCode && s.status === 'active',
    );
  };

  const activeSub = subscriptions.find((s) => s.status === 'active');

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

  const displayPlans: PlanInfo[] = plans.length > 0
    ? plans
    : [
        {
          code: 'basic_nav',
          name: '基础导航',
          price: 200,
          description: '基础导航与语音播报服务',
          features: [
            '实时导航与路径规划',
            '障碍物检测语音提醒',
            '红绿灯状态播报',
            '每日云端数据同步',
          ],
        },
        {
          code: 'value_features',
          name: '增值功能',
          price: 100,
          description: '更多实用的智能识别功能',
          features: [
            '货币面值识别',
            '药品包装辨认',
            '人脸捕捉与姓名提醒',
            '文字识别与朗读',
          ],
        },
        {
          code: 'health_manage',
          name: '健康管理',
          price: 300,
          description: '健康监测与家人关怀服务',
          features: [
            '步数与活动统计',
            '跌倒检测与自动求助',
            '家人位置共享',
            '健康数据周报',
          ],
        },
      ];

  return (
    <main className="space-y-6 p-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground">云端服务</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          订阅增值服务，享受更全面的智能助盲体验
        </p>
      </section>

      {/* 当前订阅状态 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="current-sub-heading"
      >
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="current-sub-heading"
            className="text-lg font-semibold text-foreground"
          >
            当前订阅状态
          </h2>
        </div>

        {activeSub ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">套餐名称</p>
              <p className="font-medium text-foreground">
                {activeSub.planName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">状态</p>
              <Badge variant="default">
                {activeSub.status === 'active' ? '有效' : '已过期'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">到期时间</p>
              <p className="font-medium text-foreground">
                {activeSub.endDate}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <Package
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-muted-foreground">
              您还没有订阅任何云端服务，选择下方套餐立即体验
            </p>
          </div>
        )}
      </section>

      {/* 套餐列表 */}
      <section aria-label="套餐列表">
        <h2 className="text-lg font-semibold text-foreground">可选套餐</h2>
        <div
          className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3"
          data-ai-section-type="card-list"
        >
          {displayPlans.map((plan) => {
            const subscribed = isSubscribed(plan.code);
            return (
              <div
                key={plan.code}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  {subscribed && (
                    <Badge variant="default">已订阅</Badge>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    ¥{plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 年</span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 w-full"
                  variant={subscribed ? 'secondary' : 'default'}
                  disabled={subscribed}
                  aria-label={
                    subscribed ? `${plan.name}已订阅` : `立即订阅${plan.name}`
                  }
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {subscribed ? '已订阅' : '立即订阅'}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default CloudPage;
