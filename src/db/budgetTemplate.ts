import { makeFacet } from "./client.js";

export type BudgetTemplateType = {
  accountId: string;
  templateId: string;
  max: number;
  accumulates: boolean;
};

export const BudgetTemplate = makeFacet<BudgetTemplateType>("BudgetTemplate")({
  pk: "accountId",
  sks: ["templateId"],
});
