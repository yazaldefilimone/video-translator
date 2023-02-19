import nodeGtts from "gtts";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "stream";
import got from "got";
import { assemblyRequestTranscriptAudioById, assemblyUploadAudioFileToTransplant } from "~/settings/assembly";
import { domainEvent, eventsNames } from "~/core/domain-events";
import { mkdirSync, writeFileSync } from "fs";
import { env } from "~/shared/env";
export type removeWorldsFromAudioInputType = {
  file: string;
  language: string;
};
export type convertWorldsToAudioInputType = {
  outPutFilename: string;
  worlds: {
    type: string;
    data: {
      start: number;
      end: number;
      text: string;
    };
  }[];
  language: string;
};

export const removeWorldsFromAudioPadding = async (prop: removeWorldsFromAudioInputType) => {
  try {
    const response = await assemblyUploadAudioFileToTransplant(prop.file);
    if (response.status === "error") {
      domainEvent.emit(eventsNames.errors.internalError);
      return;
    }
    if (response.status === "completed") {
      domainEvent.emit(eventsNames.audio.removedWorlds, { id: response.id });
      return;
    }

    setTimeout(() => {
      domainEvent.emit(eventsNames.audio.removePaddingWorlds, response);
    }, 3400);
  } catch (error) {
    domainEvent.emit(eventsNames.errors.internalError);
  }
};

export const removeWorldsFromAudioListem = async (id: string) => {
  try {
    const response = await assemblyRequestTranscriptAudioById(id);

    if (response.sentences.length > 0) {
      domainEvent.emit(eventsNames.audio.removedWorlds, response);
      return;
    }
  } catch (error) {
    domainEvent.emit(eventsNames.errors.internalError);
  }
};

export const convertWorldsToAudio = async (props: convertWorldsToAudioInputType) => {
  try {
    mkdirSync(props.outPutFilename);

    for (let index = 0; index < props.worlds.length; index++) {
      const voice = "agueda";
      const file = `${props.outPutFilename}/${index}.mp3`;
      await pipeline(
        Readable.from([props.worlds[index].data.text]),
        got.stream.post(`https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`, {
          headers: {
            accept: "application/octet-stream",
            "x-api-key": env.narakeet_auth,
            "content-type": "text/plain",
          },
        }),
        createWriteStream(file)
      );
    }

    setTimeout(() => {
      domainEvent.emit(eventsNames.audio.covertWorldToAudio, { file: props.outPutFilename, worlds: props.worlds });
    }, 10000);
  } catch (error) {
    console.log({ error });
    // domainEvent.emit(eventsNames.errors.error);
  }
};
