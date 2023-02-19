import { dir } from "node:console";
import { readdirSync } from "node:fs";
import { addAudioFromVideo } from "~/services/video-service";

export const bootstrap = async () => {};

// addAudioFromVideo({
//   audiosPath: "",
//   videoFile: "",
//   outVideo: "",
//   times: {},
// })
//   .then()
//   .catch((error) => console.log({ error }));

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

const dirs = readdirSync("/home/yazaldefilimone/www/learnspace/video-translator/building/audios");
console.log({
  dirs,
  total: dirs.length,
  map: dirs.map((_, index) => index),
});
