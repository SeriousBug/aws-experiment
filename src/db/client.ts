import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({});

export const ddbClient = DynamoDBDocument.from(dbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

/** Name for the table. */
export const TableName = "Primary";
/** The name of the partition key attribute. */
export const PK = "PK";
/** The name of the sort key attribute. */
export const SK = "SK";
