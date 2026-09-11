import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DevicesService } from './devices.service';

@Controller('api/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  private async extractUserId(req: Request): Promise<string> {
    const token = req.headers['x-session-token'] as string | undefined;
    return this.devicesService.getUserIdByToken(token);
  }

  @Get()
  async getDevices(@Req() req: Request) {
    const userId = await this.extractUserId(req);
    return this.devicesService.getDeviceList(userId);
  }

  @Post('bind')
  async bindDevice(@Req() req: Request, @Body() body: { snCode: string }) {
    const userId = await this.extractUserId(req);
    return this.devicesService.bindDevice(userId, body.snCode);
  }

  @Get('overview')
  async getOverview(@Req() req: Request) {
    const userId = await this.extractUserId(req);
    return this.devicesService.getOverview(userId);
  }
}
