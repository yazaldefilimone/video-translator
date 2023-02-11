import { FfmpegCommand } from "fluent-ffmpeg";
import { Ora } from "ora";
import { serverError } from "~/shared/errors";

type messageStepsService = {
  initial: string;
  connection: string;
  start: string;
  progress: string;
  error: string;
  end: string;
};
type oraType = Ora;

type stepsServiceType = {
  messageStep: messageStepsService;
  ffmpegCommand: FfmpegCommand;
  spinner: Ora;
};
export const stepsService = ({ messageStep, ffmpegCommand, spinner }: stepsServiceType): FfmpegCommand => {
  ffmpegCommand.on("connection", () => {
    spinner.text = messageStep.connection + `\n\n`;
  });

  ffmpegCommand.on("start", () => {
    spinner.text = messageStep.start + `\n\n`;
  });

  ffmpegCommand.on("progress", (progress) => {
    const percentage = progress.percent.toFixed(2);
    spinner.text = `${messageStep.progress} ${percentage}%` + `\n\n`;
  });

  ffmpegCommand.on("error", (error) => {
    console.error(messageStep.error);
    serverError(error, "removeAudioFromVideo");
  });

  return ffmpegCommand;
};
