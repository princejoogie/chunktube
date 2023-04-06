import { concludeRouter } from "./router/conclude";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  conclude: concludeRouter,
});

export type AppRouter = typeof appRouter;
