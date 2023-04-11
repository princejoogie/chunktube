import { z } from "zod";
import { EventEmitter } from "events";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclude } from "../gpt/conclude";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { conclusionSelect } from "./common";

const ee = new EventEmitter();

const cleanUrl = (url: string) => {
  // TODO: remove some query params
  return url;
};

export const conclusionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const url = cleanUrl(input.url);
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { url },
        select: conclusionSelect,
      });

      if (existing) {
        await ctx.prisma.conclusion.update({
          where: { url },
          data: { timesConcluded: { increment: 1 } },
        });
        return existing;
      }

      try {
        const { conclusions, details } = await conclude(url, ee);
        const data = await ctx.prisma.conclusion.create({
          data: {
            url,
            title: details.title,
            thumbnail: { create: details.thumbnail },
            timesConcluded: 1,
            segments: {
              createMany: {
                data: conclusions.map((e) => e),
              },
            },
          },
          select: conclusionSelect,
        });
        return data;
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  get: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ ctx, input }) => {
      const url = cleanUrl(input.url);
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { url },
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
          console.log({ input: input.url });
          const onProgress = (data: {
            message: string;
            percentage: number;
          }) => {
            emit.next({ ...data, url: input.url });
          };

          ee.on(`progress/${input.url}`, onProgress);

          return () => {
            ee.off(`progress/${input.url}`, onProgress);
          };
        }
      );
    }),
});
