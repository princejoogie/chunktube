import superjson from "superjson";
import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { ZodError } from "zod";
import { prisma } from "db";

type CreateContextOptions = {
  payload: null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    payload: opts.payload,
    prisma,
  };
};

export const createTRPCContext = async (_: CreateExpressContextOptions) => {
  /* const sessionId = req.query._clerk_session_id; */
  /* const cookies = new Cookies(req, res); */
  /* const clientToken = cookies.get("__session"); */
  /* console.log({ sessionId, clientToken }); */
  /* const session = await sessions.verifySession(sessionId, clientToken); */

  const payload = null;
  return createInnerTRPCContext({ payload });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
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
