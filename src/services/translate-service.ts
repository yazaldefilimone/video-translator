import { LeopardWord } from "@picovoice/leopard-node";
import { translate } from "@vitalets/google-translate-api";
import ora from "ora";

export type tranasteTextInputType = {
  words: LeopardWord[];
  language: string;
};

export const tranasteText = async (props: tranasteTextInputType) => {
  const spinner = ora().start();
  const wordsPromise = props.words.map(async (w, index) => {
    const percentage = ((index + 1) / props.words.length) * 100;
    spinner.text = `Traduzindo ${percentage}%`;
    const response = await translate(w.word, { to: props.language });
    return {
      ...w,
      word: response.text,
    };
  });
  const words = await Promise.all(wordsPromise);

  spinner.succeed("Tradução Concluída");

  return words;
};
