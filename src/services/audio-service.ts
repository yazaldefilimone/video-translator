import { gtts } from "~/settings/gtts";
import ora from "ora";
import { assemblyRequestTranscriptAudioById, assemblyUploadAudioFileToTransplant } from "~/settings/assembly";
import { domainEvent, eventsNames } from "~/core/domain-events";

export type removeWorldsFromAudioInputType = {
  file: string;
  language: string;
};
export type convertWorldsToAudioInputType = {
  outPutFilename: string;
  worlds: string[];
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
    if (response.status === "processing" || response.status === "queued") {
      domainEvent.emit(eventsNames.audio.removePaddingWorlds, response);
      return;
    }
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
    const executeAsync = props.worlds.map((str, index, all) => {
      const gttService = gtts(str, props.language);
      const file = `${props.outPutFilename}/${index}.mp3`;
      gttService.save(file, function (err: string | undefined) {
        spinner.text = `Processando vozes... [${index}|${all.length}]`;
        if (err) {
          domainEvent.emit(eventsNames.errors.internalError);
          return;
        }
      });
    });

    await Promise.all(executeAsync);
    spinner.succeed("Processo de vozes concluído!");
    domainEvent.emit(eventsNames.audio.covertWorldToAudio);
  } catch (error) {
    domainEvent.emit(eventsNames.errors.error);
  }
};
