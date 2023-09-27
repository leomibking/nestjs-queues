import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/send')
  public async sendMessages(
    @Query('amount') amount: number,
    @Query('routingKey') routingKey: string,
    @Query('queue') queue: string,
  ): Promise<string> {
    return this.appService.sendMessages(amount, routingKey, queue);
  }

  @Post('/consume')
  public async consume(@Query('queue') queue: string): Promise<void> {
    return this.appService.consume(queue);
  }

  @Post('/remove')
  public async remove(@Query('queue') queue: string): Promise<void> {
    return this.appService.remove(queue);
  }
}
