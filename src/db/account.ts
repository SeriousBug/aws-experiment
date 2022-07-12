import { makeFacet } from "./client.js";

export type AccountType = {
  accountId: string;
  birthday?: string;
  work?: string;
};

export const Account = makeFacet<AccountType>("Account")({
  pk: "accountId",
  sks: ["accountId"],
});
