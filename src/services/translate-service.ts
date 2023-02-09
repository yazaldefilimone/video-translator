import { translate } from "@vitalets/google-translate-api";

export type tranasteTextInputType = {
  words: string;
  language: string;
};

export const tranasteText = async (props: tranasteTextInputType): Promise<string> => {
  const response = await translate(props.words, { to: props.language });
  return response.text;
};
