import { makeHandler } from "../../../baseHandler.js";
import { BudgetTemplate } from "../../../db/budgetTemplate.js";

export const handler = makeHandler({
  handler: async ({ accountId }) => {
    return {
      body: {
        budgets: await BudgetTemplate.getAll(accountId),
      },
    };
  },
});
