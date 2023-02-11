import ora from "ora";
import ffmpeg from "fluent-ffmpeg";
import { env } from "~/shared/env";
import { messageType } from "~/shared/messages";
import { backupFolder, videosTranslatedFolder } from "~/shared/utils/core-folders";
import { stepsService } from "./setps-servece";
import { readdirSync } from "node:fs";

export type removeAudioFromVideoInputType = {
  file: string;
  outPutFilename: string;
  messages: messageType;
};
export type addAudioFromVideoInputType = {
  audiosPath: string;
  videoFile: string;
  outVideo: string;
  times: {
    [key: number]: {
      start: number;
      end: number;
    };
  };
  messages: messageType;
};
export const removeAudioFromVideo = async ({ messages, file, outPutFilename }: removeAudioFromVideoInputType) => {
  const spinner = ora().start();
  try {
    const videoStatus = messages.video;
    const backupPathAudio = backupFolder();
    const filePath = `${backupPathAudio}/${outPutFilename}.${env.extension.audio}`;
    const ffmpegCommand = ffmpeg(file).output(filePath).audioCodec(env.codec.audio);
    const lastStep = stepsService({ messageStep: videoStatus, spinner, ffmpegCommand });
    return {
      lastStep,
      spinner,
      filePath,
    };
  } catch (error) {
    spinner.stop();
    throw error;
  }
};

export const addAudioFromVideo = async (props: addAudioFromVideoInputType) => {
  const audioStatus = props.messages.audio;
  const dirs = readdirSync(props.audiosPath);
  const spinner = ora().start();

  await Promise.all(
    dirs.map(async (_file, index, all) => {
      const ffmpegCommand = ffmpeg()
        .input(props.videoFile)
        .input(`${props.audiosPath}/${index}.mp3`)
        .inputOptions([`-ss ${props.times[index].start}`, `-to ${props.times[index].end}`, "-c copy"])
        .outputOptions(["-map 0:v", "-map 1:a", "-c:v copy", "-c:a aac"])
        .save(props.outVideo);
      const lastStep = stepsService({ messageStep: audioStatus, spinner, ffmpegCommand });
      spinner.succeed(`Processado com sucesso: [${index}/${all.length}]`);
      await lastStep.run();
    })
  );

  return props.outVideo;
};
