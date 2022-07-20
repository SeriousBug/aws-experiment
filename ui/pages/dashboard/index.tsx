import type { NextPage } from "next";
import { Button, Container, Link, Spacer, Text } from "@nextui-org/react";

const Home: NextPage = () => {
  return (
    <Container>
      <Link href={process.env.NEXT_PUBLIC_LOGIN_URL}>
        <Button>Log in</Button>
      </Link>
    </Container>
  );
};

export default Home;
