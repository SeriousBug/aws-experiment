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
        currentSpend: 300,
      },
      {
        name: "Rent",
        currentSpend: 100,
      },
    ],
  };
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
  };
};
