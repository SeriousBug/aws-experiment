import type { NextPage } from "next";
import { Container, Text } from "@nextui-org/react";
import { useEffect } from "react";
import { z } from "zod";
import { authSlice } from "../../src/store/auth";
import { useAppDispatch } from "../../src/store";

const LOGIN_RESPONSE_SCHEMA = z.object({
  code: z.string().min(1),
});

const LoginCallback: NextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const loginResponse = LOGIN_RESPONSE_SCHEMA.parse(
      Object.fromEntries(
        location.search
          .replace(/^\?/, "")
          .split("&")
          .map((i) => i.split("=")),
      ),
    );
    dispatch(authSlice.actions.login(loginResponse));
  }, [dispatch]);

  return (
    <Container>
      <Text>Thanks for logging in, you will be redirected to the app now.</Text>
    </Container>
  );
};

export default LoginCallback;
