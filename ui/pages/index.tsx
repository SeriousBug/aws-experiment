import type { NextPage } from "next";
import { Button, Container, Link, Spacer, Text } from "@nextui-org/react";

const Home: NextPage = () => {
  return (
    <Container>
      <Text h1>Liquid Budgeting</Text>
      <Spacer />
      <Text h2>Flexible budgets that flow like water</Text>
      <Spacer />
      <Link href={process.env.LOGIN_URL}>
        <Button>Log in</Button>
      </Link>
    </Container>
  );
};

export default Home;
