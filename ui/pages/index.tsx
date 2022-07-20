import type { NextPage } from "next";
import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <VStack spacing={12}>
      <HStack>
        <Image src="" width={"md"} height={"md"} />
        <VStack spacing={8}>
          <Text>
            Et quia dignissimos sit quia quo delectus sed ipsam et. Amet nisi et
            adipisci quo tempore aut aut. Quo totam eligendi sit quia aliquam
            perspiciatis dolores velit.
          </Text>

          <Text>
            {" "}
            Vel veritatis expedita. Consequatur excepturi voluptatem consectetur
            deserunt. Nisi occaecati voluptates illo facilis quisquam aliquid id
            repellat est. Voluptatem molestias perspiciatis eius similique. Et
            consequatur mollitia ullam necessitatibus dolores quia sapiente.
          </Text>

          <Text>
            Unde nostrum excepturi occaecati quo quod aspernatur sed.
            Consequuntur qui voluptatem quia dicta repellendus. Rerum quia qui
            quis hic cupiditate ab qui quaerat sed. Laborum aperiam suscipit
            eum. Ut aut deleniti.
          </Text>
        </VStack>
      </HStack>
      <HStack spacing={8}>
        <VStack>
          <Heading>eos consectetur molestiae</Heading>
          <Text>
            Illo recusandae eligendi sunt eos ut nesciunt quod ducimus dolorem.
            Vitae sed veniam tempora incidunt dolor omnis. A quae dolorem
            voluptas. Porro error earum et. Enim provident labore et.
          </Text>
        </VStack>
        <VStack>
          <Heading>eligendi et ullam</Heading>
          <Text>
            Error recusandae et ut voluptate labore. Voluptatem optio et et
            occaecati error consectetur qui quas ut. Quasi possimus provident
            sunt. Sed ut est ea dolore possimus. Aut natus omnis beatae itaque
            et nemo voluptas.
          </Text>
        </VStack>
        <VStack>
          <Heading>iste consequatur necessitatibus</Heading>
          <Text>
            Dolores consequatur nostrum modi tempore veniam tempore quia natus.
            Repellendus laudantium voluptatem quaerat nihil aut. Cum quae velit
            temporibus amet. Est et tenetur repellendus ullam voluptatem harum
            inventore. Quasi est quidem dolorem ducimus veniam. Voluptas saepe
            voluptas ut consectetur qui sequi.
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Home;
