import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclude } from "../gpt/conclude";
import { TRPCError } from "@trpc/server";

const conclusionSelect = {
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

export const conclusionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { url: input.url },
        select: conclusionSelect,
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
        select: conclusionSelect,
      });
      return data;
    }),
  get: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ ctx, input }) => {
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { url: input.url },
        select: conclusionSelect,
      });

      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      return existing;
    }),
});
