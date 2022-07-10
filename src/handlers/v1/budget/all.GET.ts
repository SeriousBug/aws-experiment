import { makeHandler } from "../../../baseHandler.js";
import { BudgetUtils } from "../../../db/budget.js";

export const handler = makeHandler({
  handler: async ({ accountId }) => {
    return {
      body: {
        budgets: await BudgetUtils.getAll({ accountId }),
      },
    };
  },
});
