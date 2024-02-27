import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const exchange = await ch.assertExchange('logs', 'fanout', {durable: false})
const queue = await ch.assertQueue('', { exclusive: true })
await ch.bindQueue(queue.queue, exchange.exchange, '')
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue);
ch.consume(queue.queue, (msg) => {
    console.log(" [x] Log - %s", msg.content.toString());
    setTimeout(function() {
      console.log(" [x] Done");
      ch.ack(msg)
    }, 1000);
}, {
    noAck: false
})
