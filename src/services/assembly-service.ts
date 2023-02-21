import { assembly, assemblyRequestTranscriptAudioById, assemblyTranscriptType } from "~/settings/assembly";
import { tranasteText } from "./translate-service";

export const assemblyDeleteTranscriptById = async (id: string) => {
  try {
    const response = await assembly.delete<assemblyTranscriptType>(`/transcript/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const assemblyVerifyTranscriptById = async (id: string) => {
  try {
    const response = await assembly.get<assemblyTranscriptType>(`/transcript/${id}`);
    return {
      id: response.data?.id,
      status: response.data?.status,
    };
  } catch (error) {
    throw error;
  }
};

export const assemblyGetTranscript = async (id: string) => {
  try {
    const response = await assembly.get<assemblyTranscriptType>(`/transcript/${id}/s`);
    return {
      id: response.data?.id,
      status: response.data?.status,
    };
  } catch (error) {
    throw error;
  }
};

const assemblyVerifyPromise = (id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const verify = await assemblyVerifyTranscriptById(id);
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

export const persistAssembly = async (id: string) => {
  while (true) {
    try {
      const response = await assemblyVerifyPromise(id);
      if (response) {
        break;
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
