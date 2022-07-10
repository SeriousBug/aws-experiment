import type { ZodType } from "zod";

import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ErrorCode } from "./error.js";

export type Error = {
  code: ErrorCode;
  message: string;
};

export function makeError(code: ErrorCode, message: string): Error {
  return { code, message };
}

export type Response<D> = {
  status?: number;
  headers?: { [key: string]: string };
} & ({ body?: D } | { error: Error });

export function makeHandler<R, P = null, D = null>({
  pathParamsValidator,
  dataValidator,
  authOptional,
  handler,
}: {
  pathParamsValidator?: ZodType<P>;
  dataValidator?: ZodType<D>;
  authOptional?: boolean;
  handler: (vars: {
    pathParams: P;
    data: D;
    accountId: string;
  }) => Promise<Response<R>>;
}) {
  return async function baseHandler(
    event: APIGatewayEvent,
    context: Context,
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
    const userId = event.requestContext.authorizer?.jwt?.claims?.sub;
    if (!authOptional && !userId) {
      console.log("auth fail", JSON.stringify(context), JSON.stringify(event));
      return {
        body: JSON.stringify(
          makeError(
            ErrorCode.no_user,
            "You must be authenticated to use this endpoint.",
          ),
        ),
        statusCode: 500,
      };
    }

    // Casting these out when passing them to the handler. It's up to the
    // handler to attach the validators so it actually gets the data.
    const out = await handler({
      pathParams: pathParams as any,
      data: data as any,
      accountId: userId as string,
    });
    if ("error" in out) {
      return {
        body: JSON.stringify(out.error),
        statusCode: out.status || 500,
      };
    } else {
      return {
        body: out.body ? JSON.stringify(out.body) : "",
        statusCode: out.status || 200,
        headers: out.headers,
      };
    }
  };
}
