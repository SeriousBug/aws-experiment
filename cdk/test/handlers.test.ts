import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import test from "ava";
import { makeHandlerOptions } from "../utils/handlers.js";

test("simple", (t) => {
  t.deepEqual(makeHandlerOptions("", "foo.GET.ts"), {
    entryPoint: "foo.GET.ts",
    action: HttpMethod.GET,
    route: "/foo",
  });
});

test("nested", (t) => {
  t.deepEqual(makeHandlerOptions("", "ham/egg.GET.ts"), {
    entryPoint: "ham/egg.GET.ts",
    action: HttpMethod.GET,
    route: "/ham/egg",
  });
});

test("nested page", (t) => {
  t.deepEqual(makeHandlerOptions("", "ham/egg.GET.ts"), {
    entryPoint: "ham/egg.GET.ts",
    action: HttpMethod.GET,
    route: "/ham/egg",
  });
});

test("variable, simple", (t) => {
  t.deepEqual(makeHandlerOptions("", "[name].GET.ts"), {
    entryPoint: "[name].GET.ts",
    action: HttpMethod.GET,
    route: "/{name}",
  });
});

test("variable, nested", (t) => {
  t.deepEqual(makeHandlerOptions("", "[name]/foo.GET.ts"), {
    entryPoint: "[name]/foo.GET.ts",
    action: HttpMethod.GET,
    route: "/{name}/foo",
  });
});

test("variable, greedy", (t) => {
  t.deepEqual(makeHandlerOptions("", "[name]/[...all].GET.ts"), {
    entryPoint: "[name]/[...all].GET.ts",
    action: HttpMethod.GET,
    route: "/{name}/{all+}",
  });
});
