import { Container } from "@nextui-org/react";
import React, { FC, ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  );
};
