import { makeHandler } from "../../../baseHandler.js";
import { Account } from "../../../db/account.js";
import { BudgetTemplate } from "../../../db/budgetTemplate.js";

export const handler = makeHandler({
  handler: async ({ accountId }) => {
    await Account.delete(accountId, {
      accountId,
    });

    return {};
  },
});
