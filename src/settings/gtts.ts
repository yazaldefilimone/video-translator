import gTTS from "gtts";

export const gtts = (text: string, lang: string) => {
  const getts = new gTTS(text, lang);
  return getts;
};
