export const conclusionSelect = {
  id: true,
  url: true,
  title: true,
  thumbnail: true,
  createdAt: true,
  channelId: true,
  timesConcluded: true,
  timesViewed: true,
  segments: {
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      content: true,
      time: true,
      order: true,
    },
  },
} as const;
