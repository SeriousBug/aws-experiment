import { makeHandler } from "../../../baseHandler.js";
import { Account } from "../../../db/account.js";
import { Budget } from "../../../db/budget.js";

export const handler = makeHandler({
  handler: async ({ accountId }) => {
    await Account.delete(accountId, {
      accountId,
    });

    return {};
  },
});
