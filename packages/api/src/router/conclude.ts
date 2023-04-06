import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclude } from "../gpt/conclude";

export const concludeRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.string().optional())
    .mutation(async ({ ctx }) => {
      const input = {
        url: "https://www.youtube.com/watch?v=iO1mwxPNP5A",
      };

      console.log("concludeRouter hit", input);
      const select = {
        url: true,
        segments: {
          select: {
            id: true,
            content: true,
          },
        },
        createdAt: true,
      };

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
              data: conclusions.map((content) => ({ content })),
            },
          },
        },
        select,
      });
      return data;
    }),
});
