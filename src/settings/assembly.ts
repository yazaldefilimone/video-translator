import axios from "axios";
import { readFileSync } from "fs";
import { env } from "~/shared/env";

const authorization = env.assembly.authorization;
const url = env.assembly.baseUrl;

export const assembly = axios.create({
  baseURL: url,
  headers: {
    authorization,
  },
});

export const assemblyUpload = axios.create({
  baseURL: url,
  headers: {
    authorization,
  },
});

type sentenceType = {
  text: string;
  start: number;
  end: number;
  confidence: number;
  words: string[];
};
export type assemblyRequestTranscriptType = {
  sentences: Array<sentenceType>;
  id: string;
  confidence: number;
};

export const assemblyRequestTranscriptAudioById = async (id: string) => {
  try {
    const response = await assembly.get<assemblyRequestTranscriptType>(`/transcript/${id}/sentences`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assemblyVerifyTranscriptById = async (id: string) => {
  try {
    const response = await assembly.get<assemblyTranscriptType>(`/transcript/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export type assemblyTranscriptType = {
  id: string;
  status: "error" | "queued" | "processing" | "completed";
};
export const assemblyUploadAudioFileToTransplant = async (file: string) => {
  try {
    const buffer = readFileSync(file);
    const upload = await assemblyUpload.post<{ upload_url: string }>("/upload", buffer);
    const response = await assembly.post<assemblyTranscriptType>("/transcript", {
      audio_url: upload.data.upload_url,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
