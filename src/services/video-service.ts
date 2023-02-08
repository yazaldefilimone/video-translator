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

export const addAudioFromVideo = (props: addAudioFromVideoInputType): string => {
  const audioStatus = props.messages.audio;
  const videoFolder = videosTranslatedFolder();
  const filePath = `${videoFolder}/${props.videoFile}`;

  const spinner = loading(audioStatus.initial);
  const ffmpegCommandPrev = ffmpeg(props.videoFile).input(props.audioFile);
  const ffmpegCommand = ffmpegCommandPrev.outputOptions("-c:v copy", "-map 0:v:0", "-map 1:a:0").output(filePath);

  const lastStep = stepsService({ messageStep: audioStatus, spinner, ffmpegCommand });
  lastStep.run();

  return filePath;
};
