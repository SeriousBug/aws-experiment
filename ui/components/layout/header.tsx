import React, { FC } from "react";
import { Button, Heading, Flex, Link, Text, Spacer } from "@chakra-ui/react";
import { useIsLoggedIn } from "../../src/hook/auth";

function LoginOrUsername() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <Text>PLACEHOLDER_USERNAME</Text>;
  } else {
    return (
      <Link href={process.env.NEXT_PUBLIC_LOGIN_URL}>
        <Button>Log in</Button>
      </Link>
    );
  }
}

export const Header: FC = () => {
  return (
    <header style={{ marginTop: "1rem", marginBottom: "2rem" }}>
      <Flex>
        <Heading as="h1">Liquid Budgeting</Heading>
        <Spacer />
        <LoginOrUsername />
      </Flex>
    </header>
  );
};
