import { z } from "zod";
import { conclusionRouter } from "./router/conclusion";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  conclusion: conclusionRouter,
  test: publicProcedure.input(z.string()).mutation(({ input }) => {
    return `Hello ${input}`;
  }),
});

export type AppRouter = typeof appRouter;
