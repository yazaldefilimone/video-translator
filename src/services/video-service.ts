import ora from "ora";
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
  times: {
    [key: number]: {
      start: number;
      end: number;
    };
  };
  messages: messageType;
};
export const removeAudioFromVideo = async ({ messages, file }: removeAudioFromVideoInputType) => {
  const spinner = ora().start();
  try {
    const videoStatus = messages.video;
    const backupPathAudio = backupFolder();
    const filePath = `${backupPathAudio}/${file.split("/").at(-1)?.split(".")[0]}.${env.extension.audio}`;
    const ffmpegCommand = ffmpeg(file).output(filePath).audioCodec(env.codec.audio);
    const lastStep = stepsService({ messageStep: videoStatus, spinner, ffmpegCommand });

    lastStep.on("end", () => {
      spinner.succeed(messages.video.end);
      domainEvent.emit(eventsNames.audio.removedAudio, filePath);
    });

    lastStep.run();
  } catch (error) {
    spinner.fail(error.message ?? "error");
    throw error;
  }
};

export const addAudioFromVideo = async (props: addAudioFromVideoInputType) => {
  const audioStatus = props.messages.audio;
  const dirs = readdirSync(props.audiosPath);
  const command = ffmpeg();

  dirs.forEach((audioInput, index) => {
    command.input(`${props.audiosPath}/${index}.mp3`);
    command.complexFilter(
      `[${index}:a]atrim=start=${props.times[index].start}:end=${props.times[index].end},asetpts=PTS-STARTPTS[a${index}]`
    );
  });

  const concatFilters = dirs.map((audioInput, index) => `[a${index}]`).join("");
  command.complexFilter(`${concatFilters}concat=n=${dirs.length}:v=0:a=1[outa]`);
  command.audioCodec("libmp3lame");
  command.complexFilter("[0:v][outa]amix=inputs=2[outv]");
  command.outputOptions("-c:v copy").output(`${props.outVideo}/${props.videoFile.split("/").at(-1)}`);
  command.on("end", () => {
    domainEvent.emit("finish", `${props.outVideo}/${props.videoFile.split("/").at(-1)}`);
  });
  command.run();
};
