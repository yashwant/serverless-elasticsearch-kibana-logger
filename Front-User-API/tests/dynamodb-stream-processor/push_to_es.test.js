import * as handler from '../../src/dynamodb-stream-processor/push_to_es';

test('push_to_es_function', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await handler.main(event, context, callback);
});
