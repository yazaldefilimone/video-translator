import { writeFileSync } from "fs";
import { terminal } from "terminal-kit";
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

export const bootstrap = async () => {
  const messages = message["pt"];
  // removeAudioFromVideo({ messages, file: "/home/yazaldefilimone/www/learnspace/video-translator/videos/delba.mp4" });
  // domainEvent.on(eventsNames.audio.removedAudio, (file) => {
  //   removeWorldsFromAudioPadding({ file, language: "en" });
  // });

  // domainEvent.on(eventsNames.audio.removePaddingWorlds, (props) => {
  //   console.table({
  //     id: props?.id ?? "not found",
  //     status: props?.status ?? "not found",
  //   });
  // });

  (async () => {
    const id = "rm25zern73-7d86-4b31-9831-9a13bdab99a8";
    const myPromise = (): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        const verify = await assemblyVerifyTranscriptById(id);
        console.log({ verify });
        if (verify.status === "completed") {
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
            console.log("A resposta é:", response);
            break;
          }
        } catch (error) {
          console.error(error);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };
    persistPromise().then().catch(console.error);
  })();

  domainEvent.on(eventsNames.translate.end, async (words) => {
    convertWorldsToSrt(words);
    await convertWorldsToAudio({
      outPutFilename: "/home/yazaldefilimone/www/learnspace/video-translator/building/audios",
      worlds: words,
      language: "pt",
    });
  });
  domainEvent.on(eventsNames.subtitle.toSRT, (srt) => {
    writeFileSync("/home/yazaldefilimone/www/learnspace/video-translator/building/delba.srt", srt);
    terminal.green("Arquio de legendas salvo!");
  });
  domainEvent.on(eventsNames.audio.covertWorldToAudio, async ({ file, worlds }) => {
    const w = worlds.map((w, i) => ({ [i]: w }));
    const log = await addAudioFromVideo({
      videoFile: "/home/yazaldefilimone/www/learnspace/video-translator/videos/delba.mp4",
      audiosPath: file,
      outVideo: "/home/yazaldefilimone/www/learnspace/video-translator/building",
      times: w,
      messages,
    });
    console.log({ log });
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
    console.log({
      status: "finish",
      video: props,
    });
    process.exit();
  });
};

bootstrap()
  .then()
  .catch((error) => console.log({ error }));

// convertSubtitleFileInLines({
//   file: "/home/yazaldefilimone/www/learnspace/video-translator/building/test.srt",
// }).then((sub) => {
//   tranasteText({
//     language: "pt",
//     words: sub,
//   })
//     .then(console.log)
//     .catch(console.log);
// });
