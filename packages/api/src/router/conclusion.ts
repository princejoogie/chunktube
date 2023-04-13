import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getVideoId } from "../utils/youtube/details";
import { conclude } from "../gpt/conclude";
import { conclusionSelect, getPayload } from "./common";

const cleanUrl = (_url: string) => {
  const url = new URL(_url);

  if (url.href.includes("youtube.com")) {
    url.searchParams.delete("feature");
    url.searchParams.delete("list");
    url.searchParams.delete("index");
    url.searchParams.delete("t");
  }

  if (url.href.includes("youtu.be")) {
    url.searchParams.delete("t");
  }

  const videoId = getVideoId(url.href);
  return { url: url.href, videoId };
};

export const conclusionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().url(), token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Return the existing conclusion if it exists
      const { url, videoId } = cleanUrl(input.url);
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { videoId },
        select: conclusionSelect,
      });

      if (existing) {
        await ctx.prisma.conclusion.update({
          where: { videoId },
          data: { timesConcluded: { increment: 1 } },
        });
        return existing;
      }

      // Check if the user has credits
      const payload = getPayload(input.token);
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: payload.sub },
        select: { banned: true, credits: true, id: true },
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }

      if (user.banned) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is banned",
        });
      }

      if (user.credits <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough credits",
        });
      }

      // Create the conclusion
      const { conclusions, details } = await conclude(videoId);
      const data = await ctx.prisma.conclusion.create({
        data: {
          url,
          videoId,
          title: details.title,
          thumbnail: { create: details.thumbnail },
          timesConcluded: 1,
          segments: {
            createMany: {
              data: conclusions.map((e) => e),
            },
          },
          user: { connect: { id: user.id } },
        },
        select: conclusionSelect,
      });
      await ctx.prisma.user.update({
        where: { clerkId: payload.sub },
        data: { credits: { decrement: 1 } },
      });
      return data;
    }),
  get: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ ctx, input }) => {
      const { videoId } = cleanUrl(input.url);
      const existing = await ctx.prisma.conclusion.findUnique({
        where: { videoId },
        select: conclusionSelect,
      });

      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      return existing;
    }),
});
