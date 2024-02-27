import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const queue = await ch.assertQueue('exemple', {durable: true})

for (let index = 1; index <= 10; index++) {
    
    ch.sendToQueue(queue.queue, Buffer.from(index.toString()), {
        persistent: true
    })
    console.log(" [x] Sent '%s'", index);
}
