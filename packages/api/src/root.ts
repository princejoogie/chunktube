import { z } from "zod";
import { concludeRouter } from "./router/conclude";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  conclude: concludeRouter,
  test: publicProcedure.input(z.string()).mutation(({ input }) => {
    return `Hello ${input}`;
  }),
});

export type AppRouter = typeof appRouter;
