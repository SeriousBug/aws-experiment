import { ddbClient, PK, SK, TableName } from "./client.js";

export type Account = {
  accountId: string;
  birthday?: string;
  work?: string;
};

export class AccountUtils {
  public static async get(accountId: string): Promise<Account | undefined> {
    const { Item: item } = await ddbClient.get({
      TableName,
      Key: {
        [PK]: accountId,
        [SK]: accountId,
      },
    });
    if (!item) return undefined;
    return {
      accountId: item[PK],
      birthday: item.birthday,
      work: item.work,
    };
  }

  public static async put(account: Account) {
    await ddbClient.put({
      TableName,
      Item: {
        [PK]: account.accountId,
        [SK]: account.accountId,
        birthday: account.birthday,
        work: account.work,
      },
    });
  }
}
