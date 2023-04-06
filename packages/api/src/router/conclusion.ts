import { z } from "zod";
import { EventEmitter } from "events";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclude } from "../gpt/conclude";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";

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

const ee = new EventEmitter();

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

      const conclusions = await conclude(input.url, ee);
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
  sub: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .subscription(({ input }) => {
      return observable<{ message: string; percentage: number; url: string }>(
        (emit) => {
          const onProgress = (data: {
            message: string;
            percentage: number;
          }) => {
            emit.next({ ...data, url: input.url });
          };

          ee.on("progress", onProgress);

          return () => {
            ee.off("progress", onProgress);
          };
        }
      );
    }),
});
