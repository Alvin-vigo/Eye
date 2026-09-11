import {
  Injectable,
  Inject,
  Logger,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq, desc } from 'drizzle-orm';
import type { DeviceInfo } from '@shared/api.interface';
import { vpDevices, vpUsers } from '@server/database/schema';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

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

  private toDeviceInfo(row: typeof vpDevices.$inferSelect): DeviceInfo {
    return {
      id: row.id,
      snCode: row.snCode,
      model: row.model,
      firmwareVersion: row.firmwareVersion,
      connectionStatus: row.connectionStatus as 'online' | 'offline',
      batteryLevel: row.batteryLevel,
      lastSyncTime: row.lastSyncTime ? row.lastSyncTime.toISOString() : null,
      todayUsageMinutes: row.todayUsageMinutes,
      todayWarnings: row.todayWarnings,
      totalNavigationKm: Number(row.totalNavigationKm),
    };
  }

  async getDeviceList(userId: string): Promise<{ items: DeviceInfo[] }> {
    try {
      const devices = await this.db
        .select()
        .from(vpDevices)
        .where(eq(vpDevices.userId, userId))
        .orderBy(desc(vpDevices.createdAt));
      return { items: devices.map((d) => this.toDeviceInfo(d)) };
    } catch (error) {
      this.logger.error(`获取设备列表失败 userId=${userId}`, JSON.stringify(error));
      throw error;
    }
  }

  async bindDevice(userId: string, snCode: string): Promise<{ device: DeviceInfo }> {
    if (!snCode || snCode.trim().length === 0) {
      throw new BadRequestException('SN码不能为空');
    }
    const trimmedSn = snCode.trim();

    try {
      // 检查 SN 码是否已被绑定
      const existing = await this.db
        .select({ id: vpDevices.id, userId: vpDevices.userId })
        .from(vpDevices)
        .where(eq(vpDevices.snCode, trimmedSn))
        .limit(1);

      if (existing.length > 0 && existing[0].userId) {
        if (existing[0].userId === userId) {
          throw new ConflictException('该设备已绑定到您的账户');
        }
        throw new ConflictException('该设备已被其他用户绑定');
      }

      if (existing.length > 0) {
        // 设备存在但未绑定用户（user_id 为空的情况），更新绑定
        const updated = await this.db
          .update(vpDevices)
          .set({ userId })
          .where(eq(vpDevices.id, existing[0].id))
          .returning();
        if (updated.length === 0) {
          throw new BadRequestException('设备绑定失败');
        }
        return { device: this.toDeviceInfo(updated[0]) };
      }

      // 设备不存在，插入新设备记录并绑定
      const inserted = await this.db
        .insert(vpDevices)
        .values({
          userId,
          snCode: trimmedSn,
        })
        .returning();
      if (inserted.length === 0) {
        throw new BadRequestException('设备绑定失败');
      }
      return { device: this.toDeviceInfo(inserted[0]) };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `绑定设备失败 userId=${userId} snCode=${trimmedSn}`,
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async getOverview(
    userId: string,
  ): Promise<{
    device: DeviceInfo | null;
    todayUsageMinutes: number;
    todayWarnings: number;
    totalNavigationKm: number;
  }> {
    try {
      const devices = await this.db
        .select()
        .from(vpDevices)
        .where(eq(vpDevices.userId, userId))
        .orderBy(desc(vpDevices.createdAt))
        .limit(1);

      if (devices.length === 0) {
        return {
          device: null,
          todayUsageMinutes: 0,
          todayWarnings: 0,
          totalNavigationKm: 0,
        };
      }

      const device = this.toDeviceInfo(devices[0]);
      return {
        device,
        todayUsageMinutes: device.todayUsageMinutes,
        todayWarnings: device.todayWarnings,
        totalNavigationKm: device.totalNavigationKm,
      };
    } catch (error) {
      this.logger.error(`获取设备总览失败 userId=${userId}`, JSON.stringify(error));
      throw error;
    }
  }
}
