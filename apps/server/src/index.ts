import fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter, createContext } from "api";

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const main = async () => {
  const server = fastify({ logger: true });

  server.get("/", (_, res) => {
    res.send({ hello: "world" });
  });

  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  await server.listen({ port });
  console.log(`Server started on at http://localhost:${port}/`);
};

main().catch(console.error);
