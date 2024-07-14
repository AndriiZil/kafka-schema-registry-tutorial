'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  brokers: ['localhost:9094'],
  clientId: 'example-consumer',
});

const incomingTopic = 'incoming';

(async () => {
  try {
    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    await producer.send({
      topic: incomingTopic,
      messages: ['outgoingMessage'],
    });
  } catch (err) {
    console.error(err);
  }
})();
