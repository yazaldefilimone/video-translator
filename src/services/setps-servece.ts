import { FfmpegCommand } from "fluent-ffmpeg";
import { serverError } from "~/shared/errors";

type messageStepsService = {
  initial: string;
  connection: string;
  start: string;
  progress: string;
  error: string;
  end: string;
};

type stepsServiceType = {
  messageStep: messageStepsService;
  ffmpegCommand: FfmpegCommand;
};
export const stepsService = ({ messageStep, ffmpegCommand }: stepsServiceType): FfmpegCommand => {
  ffmpegCommand.on("connection", () => {});

  ffmpegCommand.on("start", () => {});

  ffmpegCommand.on("progress", (progress) => {
    const percentage = progress.percent.toFixed(2);
  });

  ffmpegCommand.on("error", (error) => {
    console.error(messageStep.error);
    serverError(error, "removeAudioFromVideo");
  });

  return ffmpegCommand;
};
