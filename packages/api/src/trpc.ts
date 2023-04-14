import superjson from "superjson";
import { type JwtPayload } from "./router/common";
import { type inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { ZodError } from "zod";
import { prisma } from "db";

type CreateContextOptions = {
  payload: null | JwtPayload;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    payload: opts.payload,
    prisma,
  };
};

export const createTRPCContext = async (_: CreateNextContextOptions) => {
  /* const cookies = new Cookie(req, res); */
  /* const session = cookies.get("__session"); */
  /**/
  /* if (!session) return createInnerTRPCContext({ payload: null }); */
  /**/
  /* const raw = jwtDecode(session); */
  /* const payload = sessionSchema.parse(raw); */
  return createInnerTRPCContext({ payload: null });
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

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.payload) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { payload: ctx.payload } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
