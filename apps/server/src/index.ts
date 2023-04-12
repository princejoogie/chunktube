import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import {
  type AppRouter,
  appRouter as router,
  createTRPCContext as createContext,
} from "api";

const main = async () => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors({ credentials: true, origin: "*" }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    "/trpc",
    createExpressMiddleware<AppRouter>({
      router,
      createContext,
    })
  );

  app.get("/", (_, res) => {
    res.send({ message: "Hello World!" });
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  server.on("error", console.error);

  process.on("SIGTERM", () => {
    server.close();
  });
};

main().catch(console.error);
