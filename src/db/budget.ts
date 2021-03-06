import { makeFacet } from "./client.js";

export type BudgetTemplateType = {
  accountId: string;
  templateId: string;
  // yyyy-mm
  month: string;
  max: number;
  accumulates: boolean;
};

export const Budget = makeFacet<BudgetTemplateType>("Budget")({
  pk: "accountId",
  sks: ["month", "templateId"],
});
