import { readFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { env } from "../env";
import { serverError } from "../errors";

const currentDir = (): string => {
  const dir = cwd();
  return `${dir}/../../../`;
};

export const createFolder = (pathname: string): string => {
  const dirname = currentDir();
  const dir = dirname + pathname;

  if (!existsSync(dir)) {
    mkdir(dir);
    return dir;
  }

  return dir;
};

export const videosNoTranslatedFolder = (): string => {
  const pathname = createFolder(env.videoInputFolder);
  return pathname;
};
export const videosTranslatedFolder = (): string => {
  const pathname = createFolder(env.videoOutFolder);
  return pathname;
};

export const loadAllFilesInFolder = async (path: string) => {
  const files = await readdir(path);
  return files;
};

export const readFileFolder = async (pathname: string) => {
  try {
    if (!existsSync(pathname)) {
      serverError(new Error(`This File: [${pathname.split("/").at(-1)}] is not exists`), "readFileFolder");
    }

    const files = await readFile(pathname);
    return files;
  } catch (error) {
    serverError(error, "readFileFolder");
  }
};
