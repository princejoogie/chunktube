import superjson from "superjson";
import { initTRPC } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { ZodError } from "zod";
import { prisma } from "db";

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  return { req, res, prisma };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ next }) => {
  return next({
    ctx: {
      clerkId: "test",
    },
  });

  /* return next({ */
  /*   ctx: { */
  /*     clerkId: null, */
  /*   }, */
  /* }); */
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
