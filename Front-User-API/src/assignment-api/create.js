import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib.js";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data);
  if(!data || data['lat']=='undefined' || data['long']=='undefined')
  {
    return failure({ status: false });
  }

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: uuid.v1(), //event.requestContext.identity.cognitoIdentityId,
      assignmentId: uuid.v1(),
      lat: data.lat,
      long: data.long,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
