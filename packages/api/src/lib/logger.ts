/* eslint-disable no-extra-boolean-cast */
import { log } from "next-axiom";

export const createLogger = () => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    log: (message: string) => {
      console.log(message);
    },
    error: (path: string, message: string, info?: unknown) => {
      let m = `[${path}]: ${message}`;
      if (!!info) {
        m += `\n - ${typeof info === "string" ? info : JSON.stringify(info)}`;
      }

      if (isProd) {
        log.error(m);
        return;
      }

      console.error(m);
    },
    warn: (path: string, message: string, info?: unknown) => {
      let m = `[${path}]: ${message}`;
      if (!!info) {
        m += `\n - ${typeof info === "string" ? info : JSON.stringify(info)}`;
      }

      if (isProd) {
        log.warn(m);
        return;
      }

      console.warn(m);
    },
  };
};

export const logger = createLogger();
