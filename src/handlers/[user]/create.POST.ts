import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { logEvent } from "../../logEvent";

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (event.pathParameters === null || event.body === null)
    return {
      statusCode: 400,
      body: "",
    };
  const { user } = event.pathParameters;
  const { place } = JSON.parse(event.body);

  logEvent(event, context);

  const body = {
    response: `Hello, ${user}, welcome to the ${place}.`,
  };
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
  };
};
