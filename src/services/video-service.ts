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

export const removeAudioFromVideo = ({ messages, file, outPutFilename }: removeAudioFromVideoInputType): string => {
  const videoStatus = messages.video;
  const backupPathAudio = backupFolder();
  const filePath = `${backupPathAudio}/${outPutFilename}.${env.extension.audio}`;
  const spinner = loading(videoStatus.initial);

  const ffmpegCommand = ffmpeg().input(file).output(filePath).audioCodec(env.extension.audio);
  const lastStep = stepsService({ messageStep: videoStatus, spinner, ffmpegCommand });
  lastStep.run();
  return filePath;
};
