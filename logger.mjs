import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const args = process.argv.slice(2);

const exchange = await ch.assertExchange('logs', 'topic', {durable: false})
const queue = await ch.assertQueue('', { exclusive: true })

args.forEach(function(key) {
  ch.bindQueue(queue.queue, exchange.exchange, key);
});

console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue);

ch.consume(queue.queue, (msg) => {

    console.log(" [x] %s - %s", msg.fields.routingKey, msg.content.toString());

    setTimeout(function() {
      console.log(" [x] Done");
      ch.ack(msg)
    }, 1000);
}, {
    noAck: false
})
