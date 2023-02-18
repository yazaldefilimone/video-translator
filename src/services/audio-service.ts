import nodeGtts from "gtts";
import ora from "ora";
import { assemblyRequestTranscriptAudioById, assemblyUploadAudioFileToTransplant } from "~/settings/assembly";
import { domainEvent, eventsNames } from "~/core/domain-events";
import { mkdirSync, writeFileSync } from "fs";
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
    const spinner = ora().start();
    spinner.text = "Analisando a voz do audio...";
    const response = await assemblyUploadAudioFileToTransplant(prop.file);
    if (response.status === "error") {
      spinner.fail("Ouve algum erro na analise a voz  do audio...");
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
    const spinner = ora().start();
    spinner.text = "Reconhecendo as frases...";
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
    const spinner = ora().start();
    mkdirSync(props.outPutFilename);

    for (let index = 0; index < props.worlds.length; index++) {
      const gttService = new nodeGtts(props.worlds[index].data.text ?? 'Erro nas palavrass', "pt");
      const file = `${props.outPutFilename}/${index}.mp3`;
      gttService.save(file, function (err: string | undefined) {
        if (err) {
          console.log({ err });
          return;
        }
      });
    }

    setTimeout(() => {
      domainEvent.emit(eventsNames.audio.covertWorldToAudio, { file: props.outPutFilename, worlds: props.worlds });
      spinner.succeed("Processo de vozes concluído!");
    }, 10000);
  } catch (error) {
    console.log({ error });
    // domainEvent.emit(eventsNames.errors.error);
  }
};
