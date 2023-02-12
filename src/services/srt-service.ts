import ora from "ora";
import { domainEvent, eventsNames } from "~/core/domain-events";

type words = Array<{
  text: string;
  start: number;
  end: number;
  confidence: number;
}>;

export const convertWorldsToSrt = (entries: words) => {
  const spinner = ora().start();
  let srt = "";
  let count = 1;
  entries.forEach((entry, _, all) => {
    spinner.text = `Criando  legendas [${count}|${all.length}]`;
    srt += count + "\n";
    srt += formatTime(entry.start) + " --> " + formatTime(entry.end) + "\n";
    srt += entry.text + "\n\n";
    count++;
  });
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
