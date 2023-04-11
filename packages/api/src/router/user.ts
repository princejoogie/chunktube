import { createTRPCRouter, publicProcedure } from "../trpc";
import { createOrUpdateSchema, eventSchema } from "../types";

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
        select: userBaseSelect,
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
        select: userBaseSelect,
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
