import type { NextApiRequest, NextApiResponse } from "next";
import { httpApi } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }

  if (req.body.type && typeof req.body.type === "string") {
    if (req.body.type === "user.created" || req.body.type === "user.updated") {
      const data = await httpApi.user.upsert.mutate(req.body.data);
      return res.status(200).json(data);
    }

    if (req.body.type === "user.deleted") {
      const data = await httpApi.user.delete.mutate(req.body.data);
      return res.status(200).json(data);
    }
  }

  return res.status(400).json({ code: 400, message: "Bad request" });
};

export default handler;
