import { createNextApiHandler } from "@trpc/server/adapters/next";
import {} from "next-axiom";
import { createTRPCContext, appRouter, logger } from "@ct/api";

import { env } from "@/env.mjs";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : ({ path, error }) => {
          logger.error(path ?? "/api/trpc/", error.message, error);
        },
});
