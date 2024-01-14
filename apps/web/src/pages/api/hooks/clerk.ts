import { logger } from "@ct/api";

import { httpApi } from "../../../utils/api";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ code: 405, message: "Method not allowed" });
    }

    const evt = req.body as WebhookEvent;

    if (evt.type && typeof evt.type === "string") {
      if (evt.type === "user.created") {
        const data = await httpApi.user.create.mutate({
          id: evt.data.id,
          image_url: evt.data.image_url,
          banned: false,
        });
        return res.status(200).json(data);
      }

      if (evt.type === "user.updated") {
        const data = await httpApi.user.update.mutate({
          id: evt.data.id,
          image_url: evt.data.image_url,
          banned: false,
        });
        return res.status(200).json(data);
      }

      if (evt.type === "user.deleted" && evt.data.id) {
        const data = await httpApi.user.delete.mutate({ id: evt.data.id });
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
