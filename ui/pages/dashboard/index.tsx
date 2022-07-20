import type { NextPage } from "next";
import { Container, Link, Button } from "@chakra-ui/react";

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
