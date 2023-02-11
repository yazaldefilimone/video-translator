import { assembly, assemblyTranscriptType } from "~/settings/assembly";

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
    return response.data;
  } catch (error) {
    throw error;
  }
};
