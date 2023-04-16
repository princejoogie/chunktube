import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  type ChannelDetails,
  getChannelDetails,
  getVideoId,
} from "../utils/youtube/details";
import { conclude } from "../gpt/conclude";
import { conclusionSelect } from "./common";

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
  create: protectedProcedure
    .input(z.object({ url: z.string().url() }))
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
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.payload.sub },
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
          userId: user.id,
          title: details.title,
          channelId: details.channelId,
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
      await ctx.prisma.user.update({
        where: { clerkId: ctx.payload.sub },
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

      if (!existing)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Chunk with id ${input.url} not found`,
        });

      let channelDetails: ChannelDetails | null;

      try {
        channelDetails = await getChannelDetails(existing.channelId);
      } catch {
        channelDetails = null;
      }

      const likes = await ctx.prisma.likes.aggregate({
        where: { conclusionId: existing.id },
        _count: true,
      });
      return { ...existing, likeCount: likes._count, channelDetails };
    }),
  isLiked: protectedProcedure
    .input(
      z.object({
        conclusionId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const existing = await ctx.prisma.likes.findUnique({
        where: {
          conclusionId_userId: {
            conclusionId: input.conclusionId,
            userId: ctx.payload.sub,
          },
        },
      });

      return Boolean(existing);
    }),
  addView: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.conclusion.update({
        where: { videoId: input.videoId },
        data: { timesViewed: { increment: 1 } },
      });
    }),
  toggleLike: protectedProcedure
    .input(
      z.object({
        conclusionId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.prisma.likes.findUnique({
        where: {
          conclusionId_userId: {
            conclusionId: input.conclusionId,
            userId: ctx.payload.sub,
          },
        },
      });

      if (like) {
        await ctx.prisma.likes.delete({
          where: {
            conclusionId_userId: {
              userId: ctx.payload.sub,
              conclusionId: input.conclusionId,
            },
          },
        });
        return { isLiked: false };
      } else {
        await ctx.prisma.likes.create({
          data: {
            userId: ctx.payload.sub,
            conclusionId: input.conclusionId,
          },
        });
        return { isLiked: true };
      }
    }),
});
