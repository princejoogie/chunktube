/* import { z } from "zod"; */
import { createTRPCRouter, publicProcedure } from "../trpc";
import { conclusionSelect } from "./common";

export const listRouter = createTRPCRouter({
  getTopConclusions: publicProcedure
    /* .input( */
    /*   z.object({ */
    /*     cursor: z.string().optional(), */
    /*   }) */
    /* ) */
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.conclusion.findMany({
        orderBy: { timesConcluded: "desc" },
        /* cursor: { id: input.cursor }, */
        /* skip: 1, */
        /* take: 10, */
        select: { ...conclusionSelect, timesConcluded: true },
      });
      return data;
    }),
});
