import SrtParser, { Line } from "srt-parser-2";
import { readFileFolder, writeFileFolder } from "~/shared/utils/core-folders";

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

export const convertSubtitleFileInLines = async (props: subtitleFileInLinesInputType): Promise<Line[] | undefined> => {
  try {
    const file = await readFileFolder(props.file);
    if (file) {
      const srtParser = new SrtParser();
      const output = srtParser.fromSrt(file);
      return output;
    }
  } catch (error) {
    throw error;
  }
};
