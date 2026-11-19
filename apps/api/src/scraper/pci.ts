import * as cheerio from "cheerio";
import type {
  EditalLink,
  NoticiaDetails,
  ScrapedConcurso,
} from "../types/concurso.js";
import { fetchHtml } from "../utils/http.js";

const PCI_URL = "https://www.pciconcursos.com.br/concursos/";
const ARTICLE_SELECTOR = '[itemprop="articleBody"]';
const EMPTY_DETAILS: NoticiaDetails = { editais: [], text: "" };

const cleanText = (text: string) => text.replace(/\s+/g, " ").trim();

// Text of the element itself (ignoring its children)
const ownText = (el: cheerio.Cheerio<any>) =>
  cleanText(
    el
      .contents()
      .filter((_, node) => node.type === "text")
      .text(),
  );

/* ---------- Listings ---------- */
export const parsePci = (html: string): ScrapedConcurso[] => {
  const $ = cheerio.load(html);

  return $(".ca")
    .map((_, el) => {
      const $el = $(el);
      const link = $el.find("a").first();
      const cd = $el.find(".cd");

      return {
        source: "pci",
        orgao: cleanText(link.text()),
        url: link.attr("href"),
        uf: cleanText($el.find(".cc").text()) || null,
        vagasSalario: ownText(cd),
        cargos: ownText(cd.children("span").first()),
        escolaridade: cleanText(cd.find("span span").text()),
        prazo: cleanText($el.find(".ce").text()),
      };
    })
    .get();
};

export const scrapePci = async (): Promise<ScrapedConcurso[]> =>
  parsePci(await fetchHtml(PCI_URL));

/* ---------- News page ---------- */
export const parsePciNoticia = (html: string): NoticiaDetails => {
  const $ = cheerio.load(html);

  const editais: EditalLink[] = $("a.edital-pdf-link")
    .map((_, a) => ({
      title: cleanText($(a).text()),
      url: $(a).attr("href") ?? "",
    }))
    .get()
    .filter((e) => e.url);

  return { editais, text: cleanText($(ARTICLE_SELECTOR).text()) };
};

export const fetchDetailsPci = async (
  c: ScrapedConcurso,
): Promise<NoticiaDetails> =>
  c.url ? parsePciNoticia(await fetchHtml(c.url)) : EMPTY_DETAILS;
