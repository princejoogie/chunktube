import Cookie from "cookies";
import jwt from "jsonwebtoken";
import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import { prisma } from "./lib/prisma";
import { sessionSchema } from "./utils/helpers";
import { logger } from "./lib/logger";

import type { JwtPayload } from "./utils/helpers";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { inferAsyncReturnType } from "@trpc/server";

type CreateContextOptions = {
  payload: null | JwtPayload;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    payload: opts.payload,
    prisma,
  };
};

export const createTRPCContext = ({ req, res }: CreateNextContextOptions) => {
  if (
    !process.env.CLERK_JWT_VERIFICATION_KEY ||
    typeof process.env.CLERK_JWT_VERIFICATION_KEY !== "string"
  ) {
    throw new Error("Missing Clerk JWT verification key");
  }

  try {
    const publicKey = process.env.CLERK_JWT_VERIFICATION_KEY.replace(
      /\\n/g,
      "\n"
    );
    const cookies = new Cookie(req, res);
    const sessionToken = cookies.get("__session");

    if (!sessionToken) {
      return createInnerTRPCContext({ payload: null });
    }

    const decoded = jwt.verify(sessionToken, publicKey);
    const payload = sessionSchema.parse(decoded);
    return createInnerTRPCContext({ payload });
  } catch (e) {
    logger.error("createTRPCContext", "Failed to create TRPC context", e);
    return createInnerTRPCContext({ payload: null });
  }
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
