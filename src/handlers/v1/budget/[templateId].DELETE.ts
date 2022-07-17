import { z } from "zod";
import { makeHandler } from "../../../baseHandler.js";
import { BudgetTemplate } from "../../../db/budgetTemplate.js";

export const handler = makeHandler({
  pathParamsValidator: z.object({
    templateId: z.string(),
  }),
  handler: async ({ accountId, pathParams: { templateId } }) => {
    await BudgetTemplate.delete(accountId, { templateId });
    // TODO: Delete all the budget items associated with this budget
    // Or, move the spending items into a new budget?
    return {};
  },
});
