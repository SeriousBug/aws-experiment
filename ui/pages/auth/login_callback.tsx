import type { NextPage } from "next";
import { Container, Text } from "@nextui-org/react";
import { useEffect } from "react";

const LoginCallback: NextPage = () => {
  useEffect(() => {
    const loginResponse = Object.fromEntries(
      location.hash
        .replace(/^#/, "")
        .split("&")
        .map((i) => i.split("=")),
    );
    console.log(loginResponse);
  });

  return (
    <Container>
      <Text>Thanks for logging in, you will be redirected to the app now.</Text>
    </Container>
  );
};

export default LoginCallback;
