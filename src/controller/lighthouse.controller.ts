import { Controller, Get, Inject, Post, Query } from '@midwayjs/decorator';
import { LighthouseService } from '../service/lighthouse.service';

@Controller('/lighthouse')
export class LighthouseController {
  @Inject()
  lighthouseService: LighthouseService;

  @Get('/')
  async home(): Promise<string> {
    return 'Hello lighthouse!';
  }

  @Post('/run')
  async runLighthouseBySite(
    @Query('name') name: string,
    @Query('url') url: string,
    @Query('wait') wait?: boolean
  ) {
    return await this.lighthouseService.run(name, url, wait);
  }

  @Get('/test')
  async test() {
    return await this.lighthouseService.test();
  }
}
