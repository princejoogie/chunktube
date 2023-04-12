import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createOrUpdateSchema, eventSchema } from "../types";
import { getPayload } from "./common";
import { TRPCError } from "@trpc/server";

const DEFAULT_CREDITS = 5;

const userBaseSelect = {
  banned: true,
  lastName: true,
  firstName: true,
  id: true,
  clerkId: true,
  imageUrl: true,
  credits: true,
} as const;

export const userRouter = createTRPCRouter({
  me: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const payload = getPayload(input.token);
        const user = await ctx.prisma.user.findUnique({
          where: { clerkId: payload.sub },
          select: userBaseSelect,
        });
        return user;
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token" });
      }
    }),
  create: publicProcedure
    .input(createOrUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          clerkId: input.id,
          banned: input.banned,
          imageUrl: input.image_url,
          firstName: input.first_name,
          lastName: input.last_name,
          credits: DEFAULT_CREDITS,
        },
        select: { id: true },
      });

      return user;
    }),
  update: publicProcedure
    .input(createOrUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          clerkId: input.id,
        },
        data: {
          clerkId: input.id,
          banned: input.banned,
          imageUrl: input.image_url,
          firstName: input.first_name,
          lastName: input.last_name,
        },
        select: { id: true },
      });

      return updatedUser;
    }),
  delete: publicProcedure
    .input(eventSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: input.data.id },
      });

      if (user) {
        await ctx.prisma.user.delete({
          where: { clerkId: input.data.id },
        });
        return true;
      }

      return false;
    }),
});
