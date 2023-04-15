import { prisma } from "db";
import { getVideoDetails } from "../src/utils/youtube/details";

const updateConclusion = async (id: string, videoId: string) => {
  const { channelId } = await getVideoDetails(videoId);
  return { id, channelId };
};

const main = async () => {
  const channels = await prisma.conclusion.findMany({
    where: { channelId: "" },
    select: { id: true, videoId: true },
  });

  const data = await Promise.all(
    channels.map((a) => updateConclusion(a.id, a.videoId))
  );

  const promises = data.map((a) =>
    prisma.conclusion.update({
      where: { id: a.id },
      data: { channelId: a.channelId },
    })
  );

  await Promise.all(promises);
};

main().catch(console.error);
