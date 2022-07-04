import { makeHandler } from "../../baseHandler";
import { z } from "zod";

export const handler = makeHandler({
  pathParamsValidator: z.object({
    user: z.string(),
  }),
  dataValidator: z.object({
    place: z.string(),
  }),
  handler: ({ data, pathParams }) => {
    const { user } = pathParams;
    const { place } = data;

    const body = {
      response: `Hello, ${user}, welcome to the ${place}.`,
    };
    return {
      body,
    };
  },
});
