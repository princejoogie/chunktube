import { z } from "zod";
/* import { prisma } from "db"; */
import { hasBin } from "../utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const concludeRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(({ input }) => {
      return { message: `Concluding ${input.url}...` };
    }),
  test: publicProcedure.query(async () => {
    const hasYtdl = hasBin("yt-dlp");
    const hasFFmpeg = hasBin("ffmpeg");
    return { message: { hasYtdl, hasFFmpeg } };
  }),
});
