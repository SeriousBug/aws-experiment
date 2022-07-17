import { z } from "zod";
import { makeHandler } from "../../../../baseHandler.js";
import { SpendingItem } from "../../../../db/spendingItem.js";

export const handler = makeHandler({
  pathParamsValidator: z.object({
    templateId: z.string(),
    month: z.string().regex(/^\d\d\d\d-\d\d$/),
  }),
  handler: async ({ accountId, pathParams: { templateId, month } }) => {
    return {
      body: {
        budgets: await SpendingItem.getAll(accountId, { templateId, month }),
      },
    };
  },
});
