import { z } from "zod";
import type { Prisma } from "db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const conclusionSelect = {
  id: true,
  url: true,
  title: true,
  thumbnail: true,
  createdAt: true,
  timesConcluded: true,
  segments: {
    take: 1,
    orderBy: { order: "desc" },
    select: { time: true },
  },
} as const;

const getTopChunksFilter = z.object({
  filter: z.enum(["trending", "newest", "mine"]).default("trending"),
  limit: z.number().min(1).max(100).default(8),
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
      return [{ timesConcluded: "desc" }, { createdAt: "asc" }];
    default:
      return [{ timesConcluded: "desc" }, { createdAt: "asc" }];
  }
};

export const listRouter = createTRPCRouter({
  getTopChunks: publicProcedure
    .input(getTopChunksFilter)
    .query(async ({ ctx, input }) => {
      const chunks = await ctx.prisma.conclusion.findMany({
        skip: input.cursor ? 1 : 0,
        take: input.limit,
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
