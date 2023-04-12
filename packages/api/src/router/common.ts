import jwtDecode from "jwt-decode";
import { z } from "zod";

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

export const sessionSchema = z.object({
  exp: z.number(),
  iat: z.number(),
  iss: z.string(),
  sid: z.string(),
  sub: z.string(),
});

export type JwtPayload = z.infer<typeof sessionSchema>;

export const getPayload = (token: string) => {
  const raw = jwtDecode(token);
  return sessionSchema.parse(raw);
};
