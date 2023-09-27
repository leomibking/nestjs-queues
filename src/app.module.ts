import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'poc-queues',
          type: 'topic',
        },
      ],
      uri: 'amqp://redeb2b:redeb2b@localhost:5672',
      channels: {
        'channel-01': {
          prefetchCount: 1,
          default: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
