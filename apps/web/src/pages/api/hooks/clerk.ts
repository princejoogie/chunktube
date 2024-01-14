import type { NextApiRequest, NextApiResponse } from "next";
import { httpApi } from "../../../utils/api";
import { logger } from "@ct/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ code: 405, message: "Method not allowed" });
    }

    if (req.body.type && typeof req.body.type === "string") {
      if (req.body.type === "user.created") {
        const data = await httpApi.user.create.mutate(req.body.data);
        return res.status(200).json(data);
      }

      if (req.body.type === "user.updated") {
        const data = await httpApi.user.update.mutate(req.body.data);
        return res.status(200).json(data);
      }

      if (req.body.type === "user.deleted") {
        const data = await httpApi.user.delete.mutate(req.body.data);
        return res.status(200).json(data);
      }
    }

    return res.status(400).json({ code: 400, message: "Bad request" });
  } catch (e) {
    logger.error("/api/hooks/clerk", "Clerk webhook", e);
    return res.status(500).json({ code: 500, message: JSON.stringify(e) });
  }
};

export default handler;
