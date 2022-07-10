import { nanoid } from "nanoid";
import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { BudgetUtils } from "../../../db/budget.js";

export const handler = makeHandler({
  dataValidator: z.object({
    name: z.string().min(1),
    max: z.number().min(0, "A budget can't be negative"),
    accumulates: z.boolean(),
  }),
  handler: async ({ data, accountId }) => {
    const budgetId = nanoid();
    await BudgetUtils.put({
      accountId,
      budget: {
        budgetId,
        ...data,
      },
    });

    return {
      body: {
        id: budgetId,
      },
    };
  },
});
