import { makeHandler } from "../../../baseHandler.js";
import { Budget } from "../../../db/budget.js";

export const handler = makeHandler({
  handler: async ({ accountId }) => {
    return {
      body: {
        budgets: await Budget.getAll(accountId),
      },
    };
  },
});
