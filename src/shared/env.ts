import { config } from "dotenv";
config();
export const env = {
  videoOutFolder: "translated-videos",
  videoInputFolder: "videos",
  backup: "building",
  extension: {
    audio: "mp3",
    video: "mp4",
  },
  codec: {
    audio: "libmp3lame",
  },
  deepGram: {
    key: process.env.DEEPGRAM_KEY as string,
  },
  zensia: {
    key: process.env.ZENSIA_KEY as string,
  },
};
