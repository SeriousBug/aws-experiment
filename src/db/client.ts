import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({});

export const ddbClient = DynamoDBDocument.from(dbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

function omit<O extends Record<string, unknown>, K extends keyof O>(
  obj: O,
  keys: K[],
): Omit<O, K> {
  const clone = { ...obj };
  keys.forEach((key) => delete clone[key]);
  return clone;
}

/** Name for the table. */
export const TableName = "Primary";
/** The name of the partition key attribute. */
export const PK = "PK";
/** The name of the sort key attribute. */
export const SK = "SK";

export function makeFacet<Entity extends Record<string, any>>(name: string) {
  return function facet<
    PKType extends keyof Entity,
    SKTypes extends keyof Entity,
  >({ pk, sks }: { pk: PKType; sks: SKTypes[] }) {
    // An "Entity" is a program object, an "Item" is a table construct. The main
    // difference is "Item"s have `PK` and `SK` properties. The properties that
    // back these keys are kept in the actual object for simplicity too, so
    // conversion is a matter of adding and removing these keys.

    /** The prefix for the entities of this type.
     *
     * Used to make the `getAll` queries simpler.
     */
    const skPrefix = name;

    function makeSK(entity: Pick<Entity, SKTypes>, sks: SKTypes[]): string {
      return [skPrefix, ...sks.flatMap((sk) => [sk, entity[sk]])].join("#");
    }

    function entity2item(entity: Entity): Record<string, any> {
      return {
        [PK]: entity[pk],
        [SK]: makeSK(entity, sks),
        ...entity,
      };
    }

    function item2entity(item: Record<string, any>): Entity {
      return omit(item, [PK, SK]) as Entity;
    }

    return {
      put: async function put(entity: Entity) {
        await ddbClient.put({
          TableName,
          Item: entity2item(entity),
        });
      },
      get: async function get(
        pkValue: Entity[PKType],
        skValues: Pick<Entity, SKTypes>,
      ): Promise<Entity | undefined> {
        const { Item } = await ddbClient.get({
          TableName,
          Key: {
            [PK]: pkValue,
            [SK]: makeSK(skValues, sks),
          },
        });
        if (!Item) return undefined;
        return item2entity(Item);
      },
      getAll: async function getAll(
        pkValue: Entity[PKType],
      ): Promise<Entity[]> {
        const { Items } = await ddbClient.query({
          TableName,
          KeyConditionExpression:
            ":PK = :pkValue and begins_with(:SK, :skPrefix)",
          ExpressionAttributeValues: {
            ":PK": PK,
            ":SK": SK,
            ":pkValue": pkValue,
            ":skPrefix": skPrefix,
          },
        });
        if (!Items) return [];
        return Items.map(item2entity);
      },
      delete: async function delete_(
        pkValue: Entity[PKType],
        skValues: Pick<Entity, SKTypes>,
      ) {
        await ddbClient.delete({
          TableName,
          Key: {
            [PK]: pkValue,
            [SK]: makeSK(skValues, sks),
          },
        });
      },
      deleteAll: async function deleteAll(pkValue: Entity[PKType]) {
        await ddbClient.batchWrite({
          RequestItems: {
            [TableName]: [],
          },
        });
      },
    };
  };
}
