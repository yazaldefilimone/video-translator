import ffmpeg from "fluent-ffmpeg";
import { env } from "~/shared/env";
import { messageType } from "~/shared/messages";
import { backupFolder } from "~/shared/utils/core-folders";
import { stepsService } from "./setps-servece";
import { readdirSync } from "node:fs";
import { domainEvent, eventsNames } from "~/core/domain-events";
import { terminal } from "terminal-kit";

export type removeAudioFromVideoInputType = {
  file: string;
  messages: messageType;
};
export type addAudioFromVideoInputType = {
  audiosPath: string;
  videoFile: string;
  outVideo: string;
  times: any;
};
export const removeAudioFromVideo = async ({ messages, file }: removeAudioFromVideoInputType) => {
  try {
    const videoStatus = messages.video;
    const backupPathAudio = backupFolder();
    const filePath = `${backupPathAudio}/${file.split("/").at(-1)?.split(".")[0]}.${env.extension.audio}`;
    const ffmpegCommand = ffmpeg(file).output(filePath).audioCodec(env.codec.audio);
    const lastStep = stepsService({ messageStep: videoStatus, ffmpegCommand });

    lastStep.on("end", () => {
      domainEvent.emit(eventsNames.audio.removedAudio, filePath);
    });

    lastStep.run();
  } catch (error) {
    throw error;
  }
};

export const addAudioFromVideo = async (props: addAudioFromVideoInputType) => {
  const dirs = readdirSync(props.audiosPath);
  const audios = dirs.map((dir, index) => ({ audioFile: `${props.audiosPath}/${dir}` }));
  const outputPath = "/home/yazaldefilimone/www/learnspace/video-translator/building/outputPath.mp3";
  // const audio = mergeAudios(audios, outputPath);
  let ffmpegCommand = ffmpeg();

  for (let i = 0; i < audios.length; i++) {
    const audio = audios[i];
    ffmpegCommand
      .input(audio.audioFile)
      // .seekInput(audio.start)
      // .duration(audio.end - audio.start)
      .audioCodec("libmp3lame");
  }

  ffmpegCommand.mergeToFile(outputPath);
  ffmpegCommand.output(outputPath);
  ffmpegCommand.on("error", () => {
    console.log("error in audio");
  });

  ffmpegCommand.on("end", () => {
    setTimeout(() => {
      domainEvent.emit("created", { outputPath });
    }, 2000);
  });

  ffmpegCommand.run();
};

function mergeAudios(audios, outputPath) {
  let ffmpegCommand = ffmpeg();

  for (let i = 0; i < audios.length; i++) {
    const audio = audios[i];
    ffmpegCommand
      .input(audio.audioFile)
      // .seekInput(audio.start)
      // .duration(audio.end - audio.start)
      .audioCodec("libmp3lame");
  }

  ffmpegCommand.mergeToFile(outputPath);
  ffmpegCommand.output(outputPath);
  return ffmpegCommand;
}
