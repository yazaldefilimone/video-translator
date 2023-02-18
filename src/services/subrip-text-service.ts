import { readFile } from "fs/promises";
import SrtParser, { Line } from "srt-parser-2";
import { readFileFolder, writeFileFolder } from "~/shared/utils/core-folders";
import { parseSync, stringifySync } from "subtitle";
import { readFileSync } from "fs";

export type writeSubtitleInputType = {
  srt: Line[];
  file: string;
};

export const writeSubtitleInFile = async (props: writeSubtitleInputType): Promise<string> => {
  try {
    const srtParser = new SrtParser();
    const output = srtParser.toSrt(props.srt);
    await writeFileFolder(props.file, output);
    return props.file;
  } catch (error) {
    throw error;
  }
};
export type subtitleFileInLinesInputType = {
  file: string;
};

export const convertSubtitleFileInLines = async (props: subtitleFileInLinesInputType): Promise<any> => {
  try {
    const file = readFileSync(props.file, "utf-8");
    const output = parseSync(file);
    return output;
  } catch (error) {
    throw error;
  }
};
