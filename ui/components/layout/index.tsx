import React, { FC, ReactNode } from "react";
import { Container } from "@chakra-ui/react";
import { Footer } from "./footer";
import { Header } from "./header";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container maxWidth="container.lg">
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  );
};
