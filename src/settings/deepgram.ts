import { Deepgram } from "@deepgram/sdk";
import { env } from "~/shared/env";

export const deepGram = new Deepgram(env.deepGram.key);
