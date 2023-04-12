import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "ws";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter, createContext, type AppRouter } from "api";

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const main = async () => {
  const app = express();
  const server = http.createServer(app);

  const wss = new Server({ server });
  const wsHandler = applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext,
  });

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.get("/", (_, res) => {
    res.send({ message: "Hello World!" });
  });

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  server.on("error", console.error);

  process.on("SIGTERM", () => {
    wsHandler.broadcastReconnectNotification();
    wss.close();
    server.close();
  });
};

main().catch(console.error);
