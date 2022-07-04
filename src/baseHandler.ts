import { z, ZodType } from "zod";

import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

export type Error = {
  code: string;
  message: string;
};

export type Response<D> = {
  status?: number;
  headers?: { [key: string]: string };
} & ({ body: D } | { error: Error });

export function makeHandler<R, P = null, D = null>({
  pathParamsValidator,
  dataValidator,
  handler,
}: {
  pathParamsValidator?: ZodType<P>;
  dataValidator?: ZodType<D>;
  handler: (vars: { pathParams: P; data: D }) => Response<R>;
}) {
  return async function baseHandler(
    event: APIGatewayEvent,
    _context: Context,
  ): Promise<APIGatewayProxyResult> {
    let data: D | null = null;
    let pathParams: P | null = null;

    if (dataValidator) {
      if (!event.body) {
        return {
          statusCode: 400,
          body: "A request body is required for this endpoint.",
        };
      }
      data = dataValidator.parse(JSON.parse(event.body));
    }
    if (pathParamsValidator) {
      if (!event.pathParameters) {
        console.error(
          "The handler requires path parameters, but the request doesn't have any parameters. Make sure the path for the request matches the handler.",
          {
            routeKey: event.requestContext.routeKey,
            rawPath: event.path,
            stage: event.requestContext.stage,
          },
        );
        return {
          statusCode: 500,
          body: "An internal error has occurred.",
        };
      }
      pathParams = pathParamsValidator.parse(event.pathParameters);
    }

    // Casting these out when passing them to the handler. It's up to the
    // handler to attach the validators so it actually gets the data.
    const out = await handler({
      pathParams: pathParams as any,
      data: data as any,
    });
    if ("error" in out) {
      return {
        body: JSON.stringify(out.error),
        statusCode: out.status || 500,
      };
    } else {
      return {
        body: JSON.stringify(out.body),
        statusCode: out.status || 200,
        headers: out.headers,
      };
    }
  };
}
