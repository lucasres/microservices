require('dotenv').config();

const exchange = process.env.EXCHANGE_NAME;
const request = process.env.ROUTING_KEY_REQUEST;
const results = process.env.ROUTING_KEY_RESULTS;

const amqp = require('amqplib');

// RabbitMQ connection string
const messageQueueConnectionString = process.env.BROKER_URL;

async function setup() {
  console.log("Setting up RabbitMQ Exchanges/Queues");
  // connect to RabbitMQ Instance
  let connection = await amqp.connect(messageQueueConnectionString);

  // create a channel
  let channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange(exchange, "direct", { durable: true });

  // create queues
  await channel.assertQueue(`${exchange}.${request}`, { durable: true });
  await channel.assertQueue(`${exchange}.${results}`, { durable: true });

  // bind queues
  await channel.bindQueue(`${exchange}.${request}`,exchange, request);
  await channel.bindQueue(`${exchange}.${results}`,exchange, results);

  console.log("Setup DONE");
  process.exit();
}

setup();