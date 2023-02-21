import { terminal } from "terminal-kit";
const serverError = "Internal Error, try again later";
import { intro, outro, confirm, select, spinner, isCancel, cancel, text } from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";
import { existsSync, readdirSync } from "node:fs";
import { writeFileSync } from "fs";
import { setInterval } from "timers";
import { assemblyVerifyTranscriptById, persistAssembly } from "~/services/assembly-service";
import {
  removeWorldsFromAudioPadding,
  removeWorldsFromAudioListem,
  convertWorldsToAudio,
} from "~/services/audio-service";
import { convertWorldsToSrt } from "~/services/srt-service";
import { convertSubtitleFileInLines } from "~/services/subrip-text-service";
import { tranasteText } from "~/services/translate-service";

import { removeAudioFromVideo, addAudioFromVideo } from "~/services/video-service";
import { assemblyRequestTranscriptAudioById } from "~/settings/assembly";

import { message } from "~/shared/messages";
import { domainEvent, eventsNames } from "./domain-events";
import ffmpeg from "fluent-ffmpeg";
import path from "node:path";

const rootPath = process.cwd();
const s = spinner();

async function main() {
  console.log();
  intro(color.inverse("video translator"));
  const files = readdirSync(rootPath + "/videos");
  const options = files.map((file) => ({ value: `${rootPath}/videos/${file}`, label: file }));

  const file = await select({
    message: "Selecione um video:",
    options,
  });
  if (isCancel(file)) {
    process.exit();
  }
  const initialFileName = file.split("/").at(-1)?.split(".")[0] ?? "video-translator";
  const messages = message["pt"];

  s.start("Removendo Audio do Video...");
  removeAudioFromVideo({ messages, file });

  domainEvent.on(eventsNames.audio.removedAudio, (file) => {
    s.stop("Removendo Audio do Video...");
    s.start("Processamento do audio do video...");
    removeWorldsFromAudioPadding({ file, language: "en" });
  });

  domainEvent.on(eventsNames.audio.removePaddingWorlds, ({ id }) => {
    // const id = "rm25zern73-7d86-4b31-9831-9a13bdab99a8";
    s.stop("Processamento do audio do video...");
    s.start("Convertendo o audio em texto...");
    persistAssembly(id).then();
  });

  domainEvent.on(eventsNames.translate.end, async (words) => {
    s.stop("Convertendo o audio em texto...");
    convertWorldsToSrt(words);

    s.start("Conversão de texto em audio...");
    await convertWorldsToAudio({
      outPutFilename: rootPath + "/building/audios",
      worlds: words,
      language: "pt",
    });
  });
  domainEvent.on(eventsNames.subtitle.toSRT, (srt) => {
    writeFileSync(rootPath + `/building/${initialFileName}.srt`, srt);
    s.stop("Salvando legendas...");
  });

  domainEvent.on(eventsNames.audio.covertWorldToAudio, async ({ file, worlds }) => {
    const worldsWithTimes = worlds.map((world, _) => world.data);
    s.start("Mesclando o audio traduzindo com o video original...");
    await addAudioFromVideo({
      videoFile: file,
      audiosPath: rootPath + "/building/audios",
      outVideo: rootPath + "/building",
      times: worldsWithTimes,
    });
  });

  domainEvent.on("created", ({ outputPath }) => {
    s.stop("Mesclando o audio traduzindo com o video original...");
    const command = ffmpeg();
    command
      .input(file)
      .videoCodec("copy")
      .input(outputPath)
      .seekInput(2.5)
      .audioCodec("libmp3lame")
      .outputOptions(["-map 0:v:0", "-map 1:a:0"])
      .output(rootPath + "/video-translator.mp4")
      .on("error", function (err) {
        console.log("Erro ao alterar o áudio do vídeo: " + err.message);
        process.exit();
      })
      .on("start", () => {
        s.start("Salvando o video...");
      })
      .on("end", () => {
        domainEvent.emit("finish", `${rootPath}/video-translator.mp4`);
        s.stop("video salvo...");
      })
      .on("error", (error) => {
        s.stop();
        outro(`Internal Error: ${error.toString()}`);
        process.exit();
      })
      .run();
  });

  domainEvent.on(eventsNames.errors.error, () => {
    console.error("Ouve algum  error ");
    process.exit();
  });

  domainEvent.on(eventsNames.errors.internalError, () => {
    console.error("Ouve algum  error ");
    process.exit();
  });

  domainEvent.on("finish", (props) => {
    outro("Teste o video em: " + props);
    process.exit();
  });
}

main()
  .then(() => {})
  .catch((error) => {
    s.stop();
    outro(`Internal Error: ${error.toString()}`);
  });
