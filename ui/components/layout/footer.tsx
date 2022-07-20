import { Spacer, Text } from "@nextui-org/react";
import React, { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer>
      <Text>
        Liquid Budgeting is open source software, provided as-is without
        warranty of any kind. Liquid budgeting does not provide financial or
        investment advice. Authors, and copyright holders of Liquid Budgeting
        are not liable for any claim, damages, or other liabilities.
      </Text>
      <Spacer />
      <Text>Copyright 2022, Kaan Genc</Text>
      <style jsx>{`
        footer {
          margin-top: 2rem;
        }

        footer p {
          margin: 0;
        }
      `}</style>
    </footer>
  );
};
