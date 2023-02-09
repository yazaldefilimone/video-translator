import { deepGram } from "~/settings/deepgram";
import { gtts } from "~/settings/gtts";
import { Line } from "srt-parser-2";

import { backupFolder, readFileFolder, writeFileFolder } from "~/shared/utils/core-folders";
import { readFile } from "node:fs/promises";

export type removeWorldsFromAudioInputType = {
  file: string;
  language: string;
};
export type convertWorldsToAudioInputType = {
  outPutFilename: string;
  worlds: Line[];
  language: string;
};

export const removeWorldsFromAudio = async (prop: removeWorldsFromAudioInputType) => {
  try {
    const nameFile = prop.file.split("/").at(-1)?.split(".")[0];
    const bufferFile = await readFile(prop.file);
    if (bufferFile) {
      const audio = { buffer: bufferFile, mimetype: "audio/mp3" };
      const response = await deepGram.transcription.preRecorded(audio);
      const srt = response.toSRT();
      const metadata = response.metadata;
      const webVTT = response.toWebVTT();
      const folder = backupFolder();
      const promises = [
        writeFileFolder(`${folder}/${nameFile}.srt`, JSON.stringify(srt)),
        writeFileFolder(`${folder}/${nameFile}.webVTT`, JSON.stringify(webVTT)),
        writeFileFolder(`${folder}/${nameFile}-metadata.json`, JSON.stringify(metadata)),
      ];

      await Promise.all(promises);

      return `${folder}/${nameFile}.srt`;
    }
  } catch (error) {
    throw error;
  }
};

export const convertWorldsToAudio = async (props: convertWorldsToAudioInputType) => {
  const exets = props.worlds.map((str) => {
    const gttService = gtts(str.text, "en");
    const file = `${props.outPutFilename}/${str.id}.mp3`;
    gttService.save(file, function (err: string | undefined) {
      if (err) {
        throw new Error(err);
      }
    });
  });

  Promise.all(exets);
};
