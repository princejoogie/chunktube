import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "db";

export const concludeRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(({ input }) => {
      return {
        message: `Concluded ${input.url}`,
      };
    }),
  test: publicProcedure.query(async () => {
    const user = await prisma.user.findUnique({
      where: { username: "joogie" },
    });

    if (!user) {
      return { message: "user not found" };
    }

    return { message: user.id };
  }),
});
