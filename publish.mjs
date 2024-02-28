import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const args = process.argv.slice(2);
const severity = (args.length > 0) ? args[0] : 'info';

await ch.assertExchange('logs', 'direct', {durable: false})
for (let index = 1; index <= 10; index++) {
    
    const send = ch.publish('logs', severity, Buffer.from(index.toString()), {
        persistent: true
    })
    if (send) {
        console.log(" [x] Sent '%s' to %s", index, severity);
    }
}
setTimeout(async () => {
    await conn.close()
    process.exit(0)
}, 1000)
