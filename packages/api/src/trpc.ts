import superjson from "superjson";
import { initTRPC } from "@trpc/server";
import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { ZodError } from "zod";
import { prisma } from "db";

type CreateContextOptions = {
  req: any;
  res: any;
};

const createInnerContext = (c: CreateContextOptions) => ({
  ...c,
  prisma,
});

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  return createInnerContext({ req, res });
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
  /* if (!ctx.session) { */
  /*   throw new TRPCError({ code: "UNAUTHORIZED" }); */
  /* } */

  return next({
    ctx: {
      /* session: { ...ctx.session, user: ctx.session.user }, */
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
