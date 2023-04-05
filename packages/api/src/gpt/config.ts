import { Configuration, OpenAIApi } from "openai";

export const createConfig = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("ERROR: OPENAI_API_KEY variable not set");
  return new Configuration({ apiKey });
};

export const openai = new OpenAIApi(createConfig());
