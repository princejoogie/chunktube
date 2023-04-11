export const conclusionSelect = {
  id: true,
  url: true,
  title: true,
  thumbnail: true,
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
  createdAt: true,
} as const;
