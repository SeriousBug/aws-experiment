import { ddbClient, PK, SK, TableName } from "./client.js";

export type Budget = {
  budgetId: string;
  max: number;
  accumulates: boolean;
};

export class BudgetUtils {
  private static skPrefix = "BUDGET#";

  private static key(budgetId: string) {
    return `${this.skPrefix}${budgetId}`;
  }

  private static item2entity(item: Record<string, any>): Budget {
    return {
      budgetId: item[PK],
      max: item.max,
      accumulates: item.accumulates,
    };
  }

  public static async get({
    accountId,
    budgetId,
  }: {
    accountId: string;
    budgetId: string;
  }): Promise<Budget | undefined> {
    const { Item: item } = await ddbClient.get({
      TableName,
      Key: {
        [PK]: accountId,
        [SK]: this.key(budgetId),
      },
    });
    if (!item) return undefined;
    return this.item2entity(item);
  }

  public static async getAll({
    accountId,
  }: {
    accountId: string;
  }): Promise<Budget[]> {
    const { Items: items } = await ddbClient.query({
      TableName,
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": accountId,
        ":sk": this.skPrefix,
      },
    });
    if (!items) return [];
    return items.map((item) => this.item2entity(item));
  }

  public static async put({
    budget,
    accountId,
  }: {
    accountId: string;
    budget: Budget;
  }) {
    await ddbClient.put({
      TableName,
      Item: {
        [PK]: accountId,
        [SK]: this.key(budget.budgetId),
        max: budget.max,
        accumulates: budget.accumulates,
      },
    });
  }
}
