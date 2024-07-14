'use strict';

const {
  SchemaRegistry,
  SchemaType,
} = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({
  host: 'http://localhost:8081',
  retry: {
    maxRetryTimeInSecs: 5,
    initialRetryTimeInSecs: 0.1,
    factor: 0.2, // randomization factor
    multiplier: 2, // exponential factor
    retries: 3, // max retries
  },
});

// Upload a schema to the registry
const schema = `
  {
    "type": "record",
    "name": "RandomTest",
    "namespace": "examples",
    "fields": [{ "type": "string", "name": "fullName" }]
  }
`;

(async () => {
  try {
    const { id } = await registry.register({
      type: SchemaType.AVRO,
      schema,
    });

    // Encode using the uploaded schema
    const payload = { fullName: 'John Doe' };
    const encodedPayload = await registry.encode(id, payload);

    // Decode the payload
    const decodedPayload = await registry.decode(encodedPayload);

    console.log({ decodedPayload });
    console.log(await registry.getSchema(id));
  } catch (err) {
    console.error(err);
  }
})();
