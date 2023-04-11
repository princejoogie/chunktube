import { eventSchema, createOrUpdateSchema, type EventData } from "api";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const response = { ...base, data: { ...data } };
    console.log(response);
    return res.status(200).json(response);
  }

  console.log(base);
  return res.status(200).json({ ...base });
};

export default handler;
