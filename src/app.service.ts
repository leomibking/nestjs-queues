import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  private queue = {
    exchange: 'poc-queues',
  };

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendMessages(amount: number, routingKey: string, queue: string) {
    await this.assetQueue(queue, routingKey);
    for (let i = 0; i < amount; i++) {
      this.amqpConnection.publish(this.queue.exchange, routingKey, {
        value: i,
        date: Date.now(),
      });
    }
    return 'OK';
  }

  private async assetQueue(queue: string, routingKey: string) {
    console.log(`Assert queue ${queue}`);
    await this.amqpConnection.channel.assertQueue(queue, {
      durable: true,
      autoDelete: true,
    });
    console.log(
      `Bind queue ${queue} to exchange ${this.queue.exchange} and routing key ${routingKey}`,
    );
    await this.amqpConnection.channel.bindQueue(
      queue,
      this.queue.exchange,
      routingKey,
    );
  }

  async consume(queue: string) {
    console.log(`registering a consumer for queue ${queue}`);

    await this.amqpConnection.channel.consume(
      queue,
      (msg) => {
        console.log(String(msg.content));
        this.amqpConnection.channel.ack(msg);
      },
      { consumerTag: queue },
    );
  }

  async remove(queue: string) {
    console.log('Cancel consumer');
    await this.amqpConnection.channel.cancel(queue);
  }
}
