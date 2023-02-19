import { LeopardWord } from "@picovoice/leopard-node";
import { translate } from "@vitalets/google-translate-api";
import createHttpProxyAgent from "http-proxy-agent";
import puppeteer from "puppeteer";
import { terminal } from "terminal-kit";
import { domainEvent, eventsNames } from "~/core/domain-events";

export type tranasteTextInputType = {
  words: Array<{
    type: string;
    data: {
      start: number;
      end: number;
      text: string;
    };
  }>;
  language: string;
};

export const tranasteText = async (props: tranasteTextInputType) => {
  const chrome = await puppeteer.launch();
  const chromePage = await chrome.newPage();

  await chromePage.goto(`https://translate.google.com/?sl=auto&tl=${props.language}&op=translate`);
  let selector = `[lang="${props.language}"] > span > span`;
  const translates = new Array<{
    type: string;
    data: {
      start: number;
      end: number;
      text: string;
    };
  }>();
  for (const word of props.words) {
    await chromePage.type(`textarea`, word.data.text);
    await chromePage.waitForSelector(selector);

    const translate = await chromePage.$$eval(selector, (s) => s[0].textContent?.toString());

    const button = await chromePage.$(`[aria-label="Clear source text"]`); // limpa o campo de entrada
    await button?.click();

    translates.push({
      type: word.type,
      data: {
        ...word.data,
        text: translate ?? "",
      },
    });
  }
  domainEvent.emit(eventsNames.translate.end, translates);
  await chromePage.close();
};
