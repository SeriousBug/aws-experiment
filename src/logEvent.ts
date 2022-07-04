import type { Context, APIGatewayEvent } from "aws-lambda";

export function logEvent(event: APIGatewayEvent, context: Context) {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
}
