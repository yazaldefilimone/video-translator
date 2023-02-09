import { convertWorldsToAudio, removeWorldsFromAudio } from "~/services/audio-service";
import { removeAudioFromVideo } from "~/services/video-service";
import { env } from "~/shared/env";
import { message } from "~/shared/messages";
import { videosNoTranslatedFolder } from "~/shared/utils/core-folders";

const bootstrap = async () => {
  const language = "pt";
  // const path = videosNoTranslatedFolder();
  // const file = `/home/yazaldefilimone/www/learnspace/video-translator/videos/test.mp4`;

  // const systemLanguage = message[language];

  // const audioFile = await removeAudioFromVideo({ messages: systemLanguage, file, outPutFilename: "translate" });

  // const srtFile = await removeWorldsFromAudio({
  //   file: audioFile,
  //   language: "pt",
  // });
  // console.log({ audio });
  const audio = convertWorldsToAudio({
    outPutFilename: "translate-audio",
    file: "/home/yazaldefilimone/www/learnspace/video-translator/building/audio.srt",
    language: "pt",
  });
};

bootstrap()
  .then()
  .catch((error) => console.log({ error: error.message }));
