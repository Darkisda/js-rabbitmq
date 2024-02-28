import * as amqp from 'amqplib';

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const queue = await ch.assertQueue('', { exclusive: true})
const uuid = crypto.randomUUID().toString()
const num = parseInt(args[0])

console.log(' [x] Requesting fib(%d)', num);

await ch.consume(queue.queue, (msg) => {
    if (msg.properties.correlationId === uuid) {
        console.log(' [.] Got %s', msg.content.toString());
        setTimeout(function() {
            conn.close();
            process.exit(0)
          }, 1_000);
    }
}, {
    noAck: true
})

ch.sendToQueue('rpc_queue', Buffer.from(num.toString()), {correlationId: uuid, replyTo: queue.queue})
