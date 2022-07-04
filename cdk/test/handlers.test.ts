import { makeHandlerOptions } from "../utils/handlers";

describe("basic", () => {
  test("simple", () => {
    expect(makeHandlerOptions("", "foo.GET.ts")).toEqual({
      entryPoint: "foo.GET.ts",
      action: "GET",
      route: "/foo",
    });
  });

  test("nested", () => {
    expect(makeHandlerOptions("", "ham/egg.GET.ts")).toEqual({
      entryPoint: "ham/egg.GET.ts",
      action: "GET",
      route: "/ham/egg",
    });
  });

  test("nested page", () => {
    expect(makeHandlerOptions("", "ham/egg.GET.ts")).toEqual({
      entryPoint: "ham/egg.GET.ts",
      action: "GET",
      route: "/ham/egg",
    });
  });
});

describe("variables", () => {
  test("simple", () => {
    expect(makeHandlerOptions("", "[name].GET.ts")).toEqual({
      entryPoint: "[name].GET.ts",
      action: "GET",
      route: "/{name}",
    });
  });

  test("nested", () => {
    expect(makeHandlerOptions("", "[name]/foo.GET.ts")).toEqual({
      entryPoint: "[name]/foo.GET.ts",
      action: "GET",
      route: "/{name}/foo",
    });
  });

  test("greedy", () => {
    expect(makeHandlerOptions("", "[name]/[...all].GET.ts")).toEqual({
      entryPoint: "[name]/[...all].GET.ts",
      action: "GET",
      route: "/{name}/{all+}",
    });
  });
});
