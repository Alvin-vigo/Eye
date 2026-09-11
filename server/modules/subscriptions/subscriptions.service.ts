import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq, sql } from 'drizzle-orm';
import type { PlanInfo, SubscriptionInfo } from '@shared/api.interface';
import { vpSubscriptions, vpUsers } from '@server/database/schema';

export const SUBSCRIPTION_PLANS: PlanInfo[] = [
  {
    code: 'basic_nav',
    name: '基础导航',
    price: 200,
    description: '基础障碍物检测与导航服务',
    features: ['实时障碍物检测', '语音导航指引', '红绿灯播报', '7x24小时支持'],
  },
  {
    code: 'premium_features',
    name: '增值功能',
    price: 100,
    description: '扩展 AI 识别功能',
    features: ['货币识别', '人脸捕捉', '药品辨认', '文字识别'],
  },
  {
    code: 'health_manage',
    name: '健康管理',
    price: 300,
    description: '健康监测与数据分析',
    features: ['步数统计', '跌倒检测', '心率监测', '健康报告'],
  },
];

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(@Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase) {}

  async getUserIdByToken(token: string | undefined): Promise<string> {
    if (!token) {
      throw new UnauthorizedException('会话无效或已过期');
    }
    const users = await this.db
      .select({ id: vpUsers.id })
      .from(vpUsers)
      .where(eq(vpUsers.sessionToken, token))
      .limit(1);
    if (users.length === 0) {
      throw new UnauthorizedException('会话无效或已过期');
    }
    return users[0].id;
  }

  private toSubscriptionInfo(
    row: typeof vpSubscriptions.$inferSelect,
  ): SubscriptionInfo {
    return {
      id: row.id,
      planCode: row.planCode,
      planName: row.planName,
      price: Number(row.price),
      status: row.status as 'active' | 'expired' | 'pending',
      startDate: row.startDate.toISOString(),
      endDate: row.endDate.toISOString(),
    };
  }

  async getSubscriptionList(userId: string): Promise<{ items: SubscriptionInfo[] }> {
    try {
      const subscriptions = await this.db
        .select()
        .from(vpSubscriptions)
        .where(eq(vpSubscriptions.userId, userId))
        .orderBy(
          // active 排在前面，然后按创建时间降序
          sql`CASE WHEN ${vpSubscriptions.status} = 'active' THEN 0 ELSE 1 END`,
        );
      return { items: subscriptions.map((s) => this.toSubscriptionInfo(s)) };
    } catch (error) {
      this.logger.error(
        `获取订阅列表失败 userId=${userId}`,
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async getPlans(): Promise<{ items: PlanInfo[] }> {
    return { items: SUBSCRIPTION_PLANS };
  }
}
