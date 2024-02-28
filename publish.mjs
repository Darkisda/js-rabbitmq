import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const args = process.argv.slice(2);
const key = (args.length > 0) ? args[0] : 'anonymous.info';

await ch.assertExchange('logs', 'topic', {durable: false})
for (let index = 1; index <= 10; index++) {
    
    const send = ch.publish('logs', key, Buffer.from(index.toString()), {
        persistent: true
    })
    if (send) {
        console.log(" [x] Sent '%s' to %s", index, key);
    }
}
setTimeout(async () => {
    await conn.close()
    process.exit(0)
}, 1000)
