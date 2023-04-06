import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclude } from "../gpt/conclude";

export const concludeRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const select = {
        url: true,
        segments: {
          orderBy: {
            order: "asc",
          },
          select: {
            id: true,
            content: true,
            time: true,
            order: true,
          },
        },
        createdAt: true,
      } as const;

      const existing = await ctx.prisma.conclusion.findUnique({
        where: { url: input.url },
        select,
      });

      if (existing) {
        return existing;
      }

      const conclusions = await conclude(input.url);
      const data = await ctx.prisma.conclusion.create({
        data: {
          url: input.url,
          segments: {
            createMany: {
              data: conclusions.map((e) => e),
            },
          },
        },
        select,
      });
      return data;
    }),
  test: publicProcedure
    .input(z.object({ name: z.string() }).optional())
    .query(({ input }) => {
      return `Hello ${input ? input.name : "World"}!`;
    }),
});
