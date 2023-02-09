import { readFile, readdir, mkdir, constants, writeFile } from "node:fs/promises";
import { access } from "node:fs";
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { env } from "../env";
import { serverError } from "../errors";

const currentDir = (): string => {
  const dir = cwd();
  return dir;
};

export const createFolder = (pathname: string): string => {
  const dirname = currentDir();
  const dir = dirname + "/" + pathname;

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

export const backupFolder = (): string => {
  const pathname = createFolder(env.backup);
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
export const readFilesInFolder = async (path: string) => {
  try {
    if (!existsSync(path)) {
      serverError(new Error(`This File: [${path.split("/").at(-1)}] is not exists`), "readFileFolder");
    }
    const files = await readFile(path);
    return files;
  } catch (error) {}
};

export const readFileFolder = async (pathname: string) => {
  try {
    access(pathname, constants.F_OK, (err) => {
      if (err) {
        serverError(new Error(`This File: [${pathname.split("/").at(-1)}] is not exists`), "readFileFolder");
      }
    });

    const files = await readFile(pathname, "utf-8");
    return files;
  } catch (error) {
    serverError(error, "readFileFolder");
  }
};

export const writeFileFolder = async (pathname: string, data: string) => {
  try {
    await writeFile(pathname, data, "utf-8");
    return true;
  } catch (error) {
    serverError(error, "readFileFolder");
  }
};
