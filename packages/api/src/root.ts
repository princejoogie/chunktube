import { createTRPCRouter } from "./trpc";
import { listRouter } from "./router/list";
import { conclusionRouter } from "./router/conclusion";

export const appRouter = createTRPCRouter({
  conclusion: conclusionRouter,
  list: listRouter,
});

export type AppRouter = typeof appRouter;
