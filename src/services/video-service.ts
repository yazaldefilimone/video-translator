import ora from "ora";
import ffmpeg from "fluent-ffmpeg";
import { env } from "~/shared/env";
import { messageType } from "~/shared/messages";
import { loading } from "~/shared/spinner";
import { backupFolder, videosTranslatedFolder } from "~/shared/utils/core-folders";
import { stepsService } from "./setps-servece";

export type removeAudioFromVideoInputType = {
  file: string;
  outPutFilename: string;
  messages: messageType;
};
export type addAudioFromVideoInputType = {
  audioFile: string;
  videoFile: string;
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
    lastStep.run();
    return filePath;
  } catch (error) {
    spinner.stop();
    throw error;
  }
};

export const addAudioFromVideo = (props: addAudioFromVideoInputType): string => {
  const audioStatus = props.messages.audio;
  const videoFolder = videosTranslatedFolder();
  const filePath = `${videoFolder}/${props.videoFile}`;

  const spinner = ora().start();
  const ffmpegCommandPrev = ffmpeg(props.videoFile).input(props.audioFile);
  const ffmpegCommand = ffmpegCommandPrev.outputOptions("-c:v copy", "-map 0:v:0", "-map 1:a:0").output(filePath);
  const lastStep = stepsService({ messageStep: audioStatus, spinner, ffmpegCommand });
  lastStep.run();

  return filePath;
};
