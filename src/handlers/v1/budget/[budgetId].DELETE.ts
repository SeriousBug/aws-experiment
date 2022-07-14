import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { Budget } from "../../../db/budget.js";

export const handler = makeHandler({
  pathParamsValidator: z.object({
    budgetId: z.string(),
  }),
  handler: async ({ accountId, pathParams: { budgetId } }) => {
    await Budget.delete(accountId, { budgetId });
    // TODO: Delete all the budget items associated with this budget
    // Or, move the spending items into a new budget?
    return {};
  },
});
