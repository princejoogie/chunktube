import fastify from "fastify";
import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter, createContext } from "api";

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const main = async () => {
  const server = fastify({ logger: true });

  void server.register(cors, { origin: "*" });
  void server.register(cookie, { hook: "onRequest" });
  void server.register(ws);
  void server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    useWSS: true,
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  server.get("/", (_, res) => {
    res.send({ hello: "world" });
  });

  await server.listen({ port, host: "0.0.0.0" });
  console.log(`Server started on at http://localhost:${port}/`);
};

main().catch(console.error);
