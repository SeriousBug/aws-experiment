import { nanoid } from "nanoid";
import { z } from "zod";
import { makeHandler } from "../../baseHandler.js";
import { ddbClient } from "../../db/client.js";

export const handler = makeHandler({
  dataValidator: z.object({
    email: z.string(),
    password: z.string(),
  }),
  handler: async ({ data }) => {
    const { email, password } = data;

    await ddbClient.put({
      TableName: "Auth",
      Item: {
        email,
        password,
        verified: false,
        id: nanoid(),
      },
    });

    return {
      body: {},
    };
  },
});
