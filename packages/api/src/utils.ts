import fs from "fs";
import path from "path";

const fileExistsSync = (filePath: string) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
};

const getPaths = (bin: string) => {
  const envPath = process.env.PATH || "";
  const envExt = process.env.PATHEXT || "";

  return envPath
    .replace(/["]+/g, "")
    .split(path.delimiter)
    .map(function (chunk) {
      return envExt.split(path.delimiter).map(function (ext) {
        return path.join(chunk, bin + ext);
      });
    })
    .reduce(function (a, b) {
      return a.concat(b);
    });
};

export const hasBin = (bin: string) => {
  return getPaths(bin).map(fileExistsSync).some(Boolean);
};
