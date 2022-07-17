import { makeFacet } from "./client.js";

export type SpendingItemType = {
  accountId: string;
  templateId: string;
  itemId: string;
  // ISO formatted date
  month: string;
  amount: number;
};

export const SpendingItem = makeFacet<SpendingItemType>("SpendingItem")({
  pk: "accountId",
  sks: ["templateId", "month", "itemId"],
});
