import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq } from 'drizzle-orm';
import type { SettingsInfo } from '@shared/api.interface';
import { vpSettings, vpUsers } from '@server/database/schema';

type SettingsPatch = Partial<SettingsInfo>;

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

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

  private toSettingsInfo(row: typeof vpSettings.$inferSelect): SettingsInfo {
    return {
      voiceSpeed: row.voiceSpeed as SettingsInfo['voiceSpeed'],
      voiceTone: row.voiceTone as SettingsInfo['voiceTone'],
      vibrationLevel: row.vibrationLevel,
      fontSize: row.fontSize as SettingsInfo['fontSize'],
      highContrast: row.highContrast,
      obstacleDetection: row.obstacleDetection,
      trafficLightAnnounce: row.trafficLightAnnounce,
      currencyRecognition: row.currencyRecognition,
      faceCapture: row.faceCapture,
      medicineRecognition: row.medicineRecognition,
      sosEnabled: row.sosEnabled,
    };
  }

  async getSettings(userId: string): Promise<{ settings: SettingsInfo }> {
    try {
      const rows = await this.db
        .select()
        .from(vpSettings)
        .where(eq(vpSettings.userId, userId))
        .limit(1);

      if (rows.length > 0) {
        return { settings: this.toSettingsInfo(rows[0]) };
      }

      // 没有设置记录则创建默认记录
      const inserted = await this.db
        .insert(vpSettings)
        .values({ userId })
        .returning();
      if (inserted.length === 0) {
        throw new BadRequestException('创建设置记录失败');
      }
      return { settings: this.toSettingsInfo(inserted[0]) };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `获取设置失败 userId=${userId}`,
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async updateSettings(
    userId: string,
    patch: SettingsPatch,
  ): Promise<{ settings: SettingsInfo }> {
    try {
      // 确保存在设置记录
      const existing = await this.db
        .select({ id: vpSettings.id })
        .from(vpSettings)
        .where(eq(vpSettings.userId, userId))
        .limit(1);

      let settingsId: string;
      if (existing.length === 0) {
        const inserted = await this.db
          .insert(vpSettings)
          .values({ userId })
          .returning({ id: vpSettings.id });
        if (inserted.length === 0) {
          throw new BadRequestException('创建设置记录失败');
        }
        settingsId = inserted[0].id;
      } else {
        settingsId = existing[0].id;
      }

      // 构建更新字段
      const updateData: Partial<typeof vpSettings.$inferInsert> = {};
      if (patch.voiceSpeed !== undefined) updateData.voiceSpeed = patch.voiceSpeed;
      if (patch.voiceTone !== undefined) updateData.voiceTone = patch.voiceTone;
      if (patch.vibrationLevel !== undefined) updateData.vibrationLevel = patch.vibrationLevel;
      if (patch.fontSize !== undefined) updateData.fontSize = patch.fontSize;
      if (patch.highContrast !== undefined) updateData.highContrast = patch.highContrast;
      if (patch.obstacleDetection !== undefined) updateData.obstacleDetection = patch.obstacleDetection;
      if (patch.trafficLightAnnounce !== undefined) updateData.trafficLightAnnounce = patch.trafficLightAnnounce;
      if (patch.currencyRecognition !== undefined) updateData.currencyRecognition = patch.currencyRecognition;
      if (patch.faceCapture !== undefined) updateData.faceCapture = patch.faceCapture;
      if (patch.medicineRecognition !== undefined) updateData.medicineRecognition = patch.medicineRecognition;
      if (patch.sosEnabled !== undefined) updateData.sosEnabled = patch.sosEnabled;

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      const updated = await this.db
        .update(vpSettings)
        .set(updateData)
        .where(eq(vpSettings.id, settingsId))
        .returning();
      if (updated.length === 0) {
        throw new BadRequestException('更新设置失败');
      }

      return { settings: this.toSettingsInfo(updated[0]) };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `更新设置失败 userId=${userId}`,
        JSON.stringify(error),
      );
      throw error;
    }
  }
}
