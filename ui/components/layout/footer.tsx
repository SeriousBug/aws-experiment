import React, { FC } from "react";
import { Text, HStack, Link } from "@chakra-ui/react";

export const Footer: FC = () => {
  return (
    <footer style={{ marginTop: "6rem" }}>
      <HStack spacing={4}>
        <Text color="GrayText">
          Liquid Budgeting is open source software, provided as-is without
          warranty of any kind. Liquid budgeting does not provide financial or
          investment advice. Authors, and copyright holders of Liquid Budgeting
          are not liable for any claim, damages, or other liabilities.
        </Text>
        <Text color="GrayText">
          Copyright 2022 Kaan Genc.{" "}
          <Link href="https://github.com/SeriousBug/aws-experiment">
            Source code available
          </Link>{" "}
          under
          <Link href="https://spdx.org/licenses/AGPL-3.0-only.html">
            AGPL-3.0-only
          </Link>
          .
        </Text>
      </HStack>
    </footer>
  );
};
