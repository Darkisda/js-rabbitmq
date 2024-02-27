import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

await ch.assertExchange('logs', 'fanout', {durable: false})
for (let index = 1; index <= 10; index++) {
    
    const send = ch.publish('logs', '', Buffer.from(index.toString()), {
        persistent: true
    })
    if (send) {
        console.log(" [x] Sent '%s'", index);
    }
}
// await conn.close()
// process.exit(0)
