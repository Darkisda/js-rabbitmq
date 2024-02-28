import * as amqp from 'amqplib';

const conn = await amqp.connect("amqp://localhost:5672")
const ch = await conn.createChannel();

const queue = await ch.assertQueue('rpc_queue', {durable: false})
ch.prefetch(1)
console.log(' [x] Awaiting RPC requests');

await ch.consume(queue.queue, (msg) => {
  const n = parseInt(msg.content.toString())
  console.log(" [x] Received %s", n);
  const response = fibonacci(n)
  
  ch.sendToQueue(msg.properties.replyTo, Buffer.from(response.toString()), { correlationId: msg.properties.correlationId })
  ch.ack(msg)
})

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}