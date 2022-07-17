import { nanoid } from "nanoid";
import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { BudgetTemplate } from "../../../db/budgetTemplate.js";

export const handler = makeHandler({
  dataValidator: z.object({
    name: z.string().min(1),
    max: z.number().min(0, "A budget can't be negative"),
    accumulates: z.boolean(),
  }),
  handler: async ({ data, accountId }) => {
    const templateId = nanoid();
    await BudgetTemplate.put({
      accountId,
      templateId,
      ...data,
    });

    return {
      body: {
        id: templateId,
      },
    };
  },
});
