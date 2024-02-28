import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

await ch.prefetch(1);
const exchange = await ch.assertExchange('logs', 'direct', {durable: false})
const queue = await ch.assertQueue('', {durable: true})

await ch.bindQueue(queue.queue, exchange.exchange, '')
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue);
ch.consume(queue.queue, (msg) => {
    console.log(" [x] Received %s", msg.content.toString());
    setTimeout(function() {
      console.log(" [x] Done");
      ch.ack(msg)
    }, 1000);
}, {
    noAck: false
})
