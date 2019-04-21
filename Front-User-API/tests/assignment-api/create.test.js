import * as handler from '../../src/assignment-api/create';

test('create_assignment_function', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await handler.main(event, context, callback);
});
