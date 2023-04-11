import { z } from "zod";

export const eventSchema = z
  .object({
    object: z.string(),
    type: z.enum(["user.created", "user.updated", "user.deleted"]),
    data: z
      .object({
        id: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

export const createOrUpdateSchema = z.object({
  id: z.string(),
  banned: z.boolean(),
  image_url: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type EventData =
  | {
      object: string;
      type: string;
      data:
        | z.infer<typeof createOrUpdateSchema>
        | z.infer<typeof eventSchema>["data"];
    }
  | {
      code: number;
      message: string;
    };
