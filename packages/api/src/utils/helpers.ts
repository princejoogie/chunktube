import { z } from "zod";
import { exec } from "child_process";

export const execAsync = async (command: string, errMessage?: string) => {
  return await new Promise<string>((res, rej) => {
    exec(command, (err, stdout) => {
      if (err) rej(errMessage ?? JSON.stringify(err));
      res(stdout);
    });
  });
};

export const secToHMS = (sec: number) => {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec - hours * 3600) / 60);
  const seconds = Math.floor(sec - hours * 3600 - minutes * 60);

  const h = `${hours.toString().padStart(2, "0")}`;
  const m = `${minutes.toString().padStart(2, "0")}`;
  const s = `${seconds.toString().padStart(2, "0")}`;
  const hms = `${h}:${m}:${s}`;

  return hms;
};

export const sessionSchema = z.object({
  exp: z.number(),
  iat: z.number(),
  iss: z.string(),
  sid: z.string(),
  sub: z.string(),
});

export type JwtPayload = z.infer<typeof sessionSchema>;
