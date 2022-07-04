import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { logEvent } from "../logEvent";

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logEvent(event, context);

  const body = {
    categories: [
      {
        name: "Groceries",
        max: 500,
      },
      {
        name: "Rent",
        max: 200,
      },
    ],
  };
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
  };
};
