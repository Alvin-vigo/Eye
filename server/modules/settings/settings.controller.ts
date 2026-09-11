import { Controller, Get, Patch, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { SettingsInfo } from '@shared/api.interface';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  private async extractUserId(req: Request): Promise<string> {
    const token = req.headers['x-session-token'] as string | undefined;
    return this.settingsService.getUserIdByToken(token);
  }

  @Get()
  async getSettings(@Req() req: Request) {
    const userId = await this.extractUserId(req);
    return this.settingsService.getSettings(userId);
  }

  @Patch()
  async updateSettings(@Req() req: Request, @Body() body: Partial<SettingsInfo>) {
    const userId = await this.extractUserId(req);
    return this.settingsService.updateSettings(userId, body);
  }
}
