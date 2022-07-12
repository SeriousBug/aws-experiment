import { makeFacet } from "./client.js";

export type BudgetType = {
  accountId: string;
  budgetId: string;
  max: number;
  accumulates: boolean;
};

export const Budget = makeFacet<BudgetType>("Budget")({
  pk: "accountId",
  sks: ["budgetId"],
});
