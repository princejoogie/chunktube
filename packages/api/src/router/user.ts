import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const DEFAULT_CREDITS = 5;

export const deleteSchema = z.object({
  id: z.string(),
});

export const createOrUpdateSchema = z.object({
  id: z.string(),
  banned: z.boolean(),
  image_url: z.string(),
});

const userBaseSelect = {
  banned: true,
  id: true,
  clerkId: true,
  imageUrl: true,
  credits: true,
} as const;

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: ctx.payload.sub },
      select: userBaseSelect,
    });
    return user;
  }),
  update: publicProcedure
    .input(createOrUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { clerkId: input.id },
        data: {
          clerkId: input.id,
          banned: input.banned,
          imageUrl: input.image_url,
        },
        select: { id: true },
      });

      return updatedUser;
    }),
  create: publicProcedure
    .input(createOrUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.create({
        data: {
          clerkId: input.id,
          banned: input.banned,
          imageUrl: input.image_url,
          credits: DEFAULT_CREDITS,
        },
        select: { id: true },
      });

      return updatedUser;
    }),
  delete: publicProcedure
    .input(deleteSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: input.id },
      });

      if (user) {
        await ctx.prisma.user.delete({
          where: { clerkId: input.id },
        });
        return true;
      }

      return false;
    }),
});
