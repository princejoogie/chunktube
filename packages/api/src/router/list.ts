import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import type { Prisma } from "@ct/db";

export const conclusionSelect = {
  id: true,
  url: true,
  title: true,
  thumbnail: true,
  createdAt: true,
  timesConcluded: true,
  timesViewed: true,
  segments: {
    take: 1,
    orderBy: { order: "desc" },
    select: { time: true },
  },
} as const;

const getTopChunksFilter = z.object({
  filter: z.enum(["trending", "newest", "mine"]).default("trending"),
  limit: z.number().min(1).nullish(),
  cursor: z.string().nullish(),
});

type Filter = z.infer<typeof getTopChunksFilter>;

const getFilterOrderBy = (
  f: Filter
): Prisma.Enumerable<Prisma.ConclusionOrderByWithRelationInput> => {
  switch (f?.filter) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "mine":
      return [{ createdAt: "desc" }];
    case "trending":
      return [
        { timesViewed: "desc" },
        { timesConcluded: "desc" },
        { createdAt: "desc" },
      ];
    default:
      return [
        { timesViewed: "desc" },
        { timesConcluded: "desc" },
        { createdAt: "desc" },
      ];
  }
};

export const listRouter = createTRPCRouter({
  getTopChunks: publicProcedure
    .input(getTopChunksFilter)
    .query(async ({ ctx, input }) => {
      const chunks = await ctx.prisma.conclusion.findMany({
        skip: input.cursor ? 1 : 0,
        take: input.limit ?? undefined,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        orderBy: getFilterOrderBy(input),
        where:
          input?.filter === "mine"
            ? { user: { clerkId: ctx.payload?.sub ?? "" } }
            : undefined,
        select: { ...conclusionSelect },
      });

      const cursor = chunks[chunks.length - 1]?.id ?? null;
      return { cursor, chunks };
    }),
});
