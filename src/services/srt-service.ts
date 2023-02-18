import ora from "ora";
import { stringifySync } from "subtitle";
import { domainEvent, eventsNames } from "~/core/domain-events";

type words = Array<{
  text: string;
  start: number;
  end: number;
  confidence: number;
}>;

export const convertWorldsToSrt = (entries: any) => {
  const spinner = ora().start();
  let count = 1;

  const srt = stringifySync(entries, { format: "SRT" });
  spinner.succeed("Legendas geradas com sucesso!!!");
  domainEvent.emit(eventsNames.subtitle.toSRT, srt);
};

function formatTime(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds - minutes * 60);
  const milliseconds = Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 1000);
  return `${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 3)}`;
}

function pad(num: number, size: number) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
