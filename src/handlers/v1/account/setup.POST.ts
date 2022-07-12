import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { Account } from "../../../db/account.js";

export const handler = makeHandler({
  dataValidator: z.object({
    birthday: z.string().min(1).optional(),
    work: z.string().min(1).optional(),
  }),
  handler: async ({ data, accountId }) => {
    await Account.put({
      accountId,
      ...data,
    });

    return {};
  },
});
