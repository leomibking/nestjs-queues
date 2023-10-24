import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { SubscribeResponse } from '@golevelup/nestjs-rabbitmq/lib/amqp/handlerResponses';

type MsgPayload = {
  value: number;
  date: Date;
};

@Injectable()
export class AppService {
  private queue = {
    exchange: 'poc-queues',
  };

  constructor(private readonly amqpConnection: AmqpConnection) {}

  // @RabbitSubscribe({
  //   queue: 'temp-queue',
  //   routingKey: 'a.b.c',
  //   exchange: 'poc-queues',
  // })
  public consumeTest(msg: any) {
    console.log(JSON.stringify(msg));
  }

  async sendMessages(amount: number, routingKey: string) {
    for (let i = 0; i < amount; i++) {
      this.amqpConnection.publish(this.queue.exchange, routingKey, {
        value: i,
        date: Date.now(),
      });
    }
    return 'OK';
  }

  public async create(queue: string, routingKey: string) {
    console.log(`Assert queue ${queue}`);

    await this.amqpConnection.createSubscriber<MsgPayload>(
      (msg: MsgPayload): Promise<SubscribeResponse> => {
        console.log(msg);
        return;
      },
      { queue, routingKey, queueOptions: { durable: true, autoDelete: false } },
      'tst-create',
      { consumerTag: queue },
    );

    // await this.amqpConnection.channel.assertQueue(queue, {
    //   durable: true,
    //   autoDelete: true,
    // });
    // console.log(
    //   `Bind queue ${queue} to exchange ${this.queue.exchange} and routing key ${routingKey}`,
    // );
    // await this.amqpConnection.channel.bindQueue(
    //   queue,
    //   this.queue.exchange,
    //   routingKey, //importacao.produto.id-marca
    // );
  }

  async consume(queue: string) {
    console.log(`registering a consumer for queue ${queue}`);

    // await this.amqpConnection.channel.consume(
    //   queue,
    //   (msg) => {
    //     console.log(String(msg.content));
    //     this.amqpConnection.channel.ack(msg);
    //   },
    //   { consumerTag: queue },
    // );
  }

  async pause(queue: string) {
    console.log(`pause consumer ${queue}`);
    await this.amqpConnection.cancelConsumer(queue);
  }

  async resume(queue: string) {
    console.log(`resume consumer ${queue}`);
    await this.amqpConnection.resumeConsumer(queue);
  }
}
