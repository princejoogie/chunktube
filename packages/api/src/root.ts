import { createTRPCRouter } from "./trpc";
import { listRouter } from "./router/list";
import { userRouter } from "./router/user";
import { conclusionRouter } from "./router/conclusion";

export const appRouter = createTRPCRouter({
  conclusion: conclusionRouter,
  list: listRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
