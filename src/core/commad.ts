import { terminal } from "terminal-kit";
const serverError = "Internal Error, try again later";
import { intro, outro, confirm, select, spinner, isCancel, cancel, text } from "@clack/prompts";
import { setTimeout as sleep } from "node:timers/promises";
import color from "picocolors";
import { existsSync, readdirSync } from "node:fs";
import { writeFileSync } from "fs";
import { setInterval } from "timers";
import { assemblyVerifyTranscriptById } from "~/services/assembly-service";
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
const rootPath = "/home/yazaldefilimone/www/learnspace/video-translator/videos";
async function main() {
  console.log();
  intro(color.inverse("video translator"));
  const files = readdirSync(rootPath);
  const options = files.map((file) => ({ value: `${rootPath}/${file}`, label: file }));
  const file = await select({
    message: "Select video file in root folder:",
    options,
  });
  if (isCancel(file)) {
    process.exit();
  }

  const s = spinner();
  const messages = message["pt"];

  s.start("Removendo Audio do Video...");
  removeAudioFromVideo({ messages, file });

  domainEvent.on(eventsNames.audio.removedAudio, (file) => {
    s.start("Processamento do audio do video...");
    removeWorldsFromAudioPadding({ file, language: "en" });
  });
  domainEvent.on(eventsNames.audio.removePaddingWorlds, ({ id }) => {
    // const id = "rm25zern73-7d86-4b31-9831-9a13bdab99a8";
    const myPromise = (): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        const verify = await assemblyVerifyTranscriptById(id);
        if (verify.status === "completed") {
          s.start("conversão do audio em texto...");
          const subtitles = await assemblyRequestTranscriptAudioById(id);
          const format = subtitles.sentences.map((entrie) => {
            return {
              type: "cue" as const,
              data: {
                start: entrie.start, // milliseconds
                end: entrie.end,
                text: entrie.text,
              },
            };
          });
          s.start("Tradução...");
          await tranasteText({
            words: format,
            language: "pt",
          });

          resolve(true);
        } else {
          reject(new Error("A resposta ainda não está pronta"));
        }
      });
    };

    const persistPromise = async () => {
      while (true) {
        try {
          const response = await myPromise();
          if (response) {
            break;
          }
        } catch (error) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };
    persistPromise().then();
  });

  domainEvent.on(eventsNames.translate.end, async (words) => {
    convertWorldsToSrt(words);
    s.start("Conversão de texto em audio...");
    await convertWorldsToAudio({
      outPutFilename: "/home/yazaldefilimone/www/learnspace/video-translator/building/audios",
      worlds: words,
      language: "pt",
    });
  });
  domainEvent.on(eventsNames.subtitle.toSRT, (srt) => {
    writeFileSync("/home/yazaldefilimone/www/learnspace/video-translator/building/delba.srt", srt);
    s.start("Salvando legendas...");
  });
  domainEvent.on(eventsNames.audio.covertWorldToAudio, async ({ file, worlds }) => {
    const w = worlds.map((w, i) => w.data);
    s.start("Salvando o video traduzindo...");
    const log = await addAudioFromVideo({
      videoFile: "/home/yazaldefilimone/www/learnspace/video-translator/videos/delba.mp4",
      audiosPath: "/home/yazaldefilimone/www/learnspace/video-translator/building/audios",
      outVideo: "/home/yazaldefilimone/www/learnspace/video-translator/building",
      times: w,
    });
    s.stop("video traduzindo...");
  });

  // domainEvent.on("created", ({ outputPath }) => {
  //   s.stop("Salvando...");
  //   const command = ffmpeg();
  //   command.input("/home/yazaldefilimone/www/learnspace/video-translator/videos/delba.mp4");
  //   command.input("/home/yazaldefilimone/www/learnspace/video-translator/building/outputPath.mp3").seekInput(2.5);
  //   command.videoCodec("copy");
  //   command.audioCodec("libmp3lame");
  //   command.outputOptions(["-map 0:v:0", "-map 1:a:0"]);
  //   command.output("finish.mp4");
  //   command.on("error", function (err) {
  //     console.log("Erro ao alterar o áudio do vídeo: " + err.message);
  //     process.exit();
  //   });
  //   command.on("end", () => {
  //     domainEvent.emit("finish", `./finish.mp4`);
  //   });
  //   command.run();
  // });
  domainEvent.on(eventsNames.errors.error, () => {
    console.error("Ouve algum  error ");
    process.exit();
  });
  domainEvent.on(eventsNames.errors.internalError, () => {
    console.error("Ouve algum  error ");
    process.exit();
  });
  domainEvent.on("finish", (props) => {
    console.log({
      status: "finish",
      video: props,
    });
    process.exit();
  });
}

main()
  .then(() => {
    domainEvent.on("created", ({ outputPath }) => {
      const command = ffmpeg();
      command
        .input(path.join(__dirname, "../../videos/delba.mp4"))
        .videoCodec("copy")
        .input(outputPath)
        .seekInput(2.5)
        .audioCodec("libmp3lame")
        .outputOptions(["-map 0:v:0", "-map 1:a:0"])
        .output(path.join(__dirname, "../../finish.mp4"))
        .on("error", function (err) {
          console.log("Erro ao alterar o áudio do vídeo: " + err.message);
          process.exit();
        })
        .on("end", () => {
          domainEvent.emit("finish", `./finish.mp4`);
        })
        .run();
    });
  })
  .catch(console.error);
