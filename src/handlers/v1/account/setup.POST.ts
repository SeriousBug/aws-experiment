import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { AccountUtils } from "../../../db/account.js";

export const handler = makeHandler({
  dataValidator: z.object({
    birthday: z.string().min(1).optional(),
    work: z.string().min(1).optional(),
  }),
  handler: async ({ data, accountId }) => {
    await AccountUtils.put({
      accountId,
      ...data,
    });

    return {};
  },
});
