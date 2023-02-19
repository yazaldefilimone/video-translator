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
  LEOPARD: {
    accessKey: process.env.LEOPARD as string,
  },
  zensia: {
    key: process.env.ZENSIA_KEY as string,
  },
  assembly: {
    authorization: process.env.ASSEMBLY_AUTH,
    baseUrl: process.env.ASSEMBLY_BASE_URL,
  },
  narakeet_auth: process.env.NARAKEET_AUTH as string,
};
