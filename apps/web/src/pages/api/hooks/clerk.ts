import { eventSchema, createOrUpdateSchema, type EventData } from "api";
import type { NextApiRequest, NextApiResponse } from "next";
import { httpApi } from "../../../utils/api";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventData>
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }

  const base = eventSchema.parse(req.body);
  if (base.type === "user.created" || base.type === "user.updated") {
    const data = createOrUpdateSchema.parse(base.data);

    if (base.type === "user.created") {
      await httpApi.user.create.mutate(data);
      return res.status(200).json(data);
    }

    await httpApi.user.update.mutate(data);
    return res.status(200).json(data);
  }

  if (base.type === "user.deleted") {
    await httpApi.user.delete.mutate(base);
    return res.status(200).json(base);
  }

  return res.status(400).json({ code: 400, message: "Bad request" });
};

export default handler;
