import { Controller, Get } from '@nestjs/common';
import { HelpService } from './help.service';

@Controller('api/help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('faqs')
  async getFaqs() {
    return this.helpService.getFaqs();
  }

  @Get('categories')
  async getCategories() {
    return this.helpService.getCategories();
  }
}
