import { makeHandler } from "../baseHandler";

export const handler = makeHandler({
  handler: () => {
    const body = {
      categories: [
        {
          name: "Groceries",
          currentSpend: 300,
        },
        {
          name: "Rent",
          currentSpend: 100,
        },
      ],
    };
    return {
      body,
    };
  },
});
