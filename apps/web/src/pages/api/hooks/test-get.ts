import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ message: "Hello World" });
};

export default handler;
