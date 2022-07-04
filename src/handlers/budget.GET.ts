import { makeHandler } from "../baseHandler";

export const handler = makeHandler({
  handler: () => {
    const body = {
      categories: [
        {
          name: "Groceries",
          max: 500,
        },
        {
          name: "Rent",
          max: 200,
        },
      ],
    };
    return {
      body,
    };
  },
});
