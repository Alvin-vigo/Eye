import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  private async extractUserId(req: Request): Promise<string> {
    const token = req.headers['x-session-token'] as string | undefined;
    return this.subscriptionsService.getUserIdByToken(token);
  }

  @Get()
  async getSubscriptions(@Req() req: Request) {
    const userId = await this.extractUserId(req);
    return this.subscriptionsService.getSubscriptionList(userId);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }
}
