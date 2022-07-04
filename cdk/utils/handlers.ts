/**
 * Handlers are routed based on file names.
 *
 * foo.GET.ts -> matches GET /foo
 * GET.ts -> matches GET /
 * foo/bar.GET.ts -> matches GET /foo/bar
 * foo/bar/GET.ts -> matches GET /foo/bar/
 */
import { getFiles } from "./getFiles";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import * as path from "path";

const HANDLER_PATH =
  /(?<fullPath>[[\]a-zA-Z0-9\-_.,/]*)[.](?<method>[a-zA-Z]+).ts/;

const HANDLER_PATH_SEGMENT =
  /^\[(?<variable>[a-zA-Z0-9\-_.,]+)\]$|^(?<segment>[a-zA-Z0-9a-zA-Z0-9\-_.,/]+)$/;

export function findHandlers(base: string) {
  // All files inside the handler directory should be handlers.
  // Collect all of them and get the handler options.
  return getFiles(base).map((file) => makeHandlerOptions(base, file));
}

export type HandlerOptions = {
  /** The file that contains the entrypoint for this handler. */
  entryPoint: string;
  /** The HTTP action handler responds to, like GET or POST. */
  action: HttpMethod;
  /** The route the handler will map to. */
  route: string;
};

function isHttpMethod(s: string): s is HttpMethod {
  return Object.keys(HttpMethod).includes(s);
}

export function makeHandlerOptions(
  base: string,
  entryPoint: string,
): HandlerOptions {
  const { fullPath, method } = HANDLER_PATH.exec(entryPoint)?.groups || {};
  if (!method && !fullPath) {
    throw `Path for handler ${entryPoint} is ill-formatted`;
  }
  if (!method) {
    throw `Handler ${entryPoint} has no action. Add one by naming the file like '${fullPath}.GET.ts'`;
  }
  const route = path
    .relative(base, fullPath)
    .replace("\\", "/")
    .split("/")
    .map((pathSegment) => {
      if (pathSegment === "") return "";
      const { variable, segment } =
        HANDLER_PATH_SEGMENT.exec(pathSegment)?.groups || {};
      if (variable) {
        if (variable.startsWith("...")) {
          return `{${variable.slice(3)}+}`;
        }
        return `{${variable}}`;
      }
      if (segment) {
        return segment;
      }
      throw `Bad segment ${pathSegment} in handler ${entryPoint}`;
    })
    .join("/");

  const action = method.toUpperCase();
  if (!isHttpMethod(action)) {
    throw `Action ${method} for ${fullPath} is not valid. Use one of ${Object.keys(
      HttpMethod,
    ).join(", ")}`;
  }
  return {
    entryPoint,
    action,
    route: `/${route}`,
  };
}
