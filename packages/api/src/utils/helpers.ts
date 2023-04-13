import { exec } from "child_process";

export const execAsync = async (command: string, errMessage?: string) => {
  return await new Promise<string>((res, rej) => {
    exec(command, (err, stdout) => {
      if (err) rej(errMessage ?? JSON.stringify(err));
      res(stdout);
    });
  });
};
