import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/send')
  public async sendMessages(
    @Query('amount') amount: number,
    @Query('routingKey') routingKey: string,
  ): Promise<string> {
    return this.appService.sendMessages(amount, routingKey);
  }

  @Post('/create')
  public async create(
    @Query('routingKey') routingKey: string,
    @Query('queue') queue: string,
  ): Promise<void> {
    return this.appService.create(queue, routingKey);
  }

  @Post('/consume')
  public async consume(@Query('queue') queue: string): Promise<void> {
    return this.appService.consume(queue);
  }

  @Post('/pause')
  public async remove(@Query('queue') queue: string): Promise<void> {
    return this.appService.pause(queue);
  }

  @Post('/resume')
  public async resume(@Query('queue') queue: string): Promise<void> {
    return this.appService.resume(queue);
  }
}
