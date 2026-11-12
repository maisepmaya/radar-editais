import * as cheerio from "cheerio";
import { ScrapedConcurso } from "../types/concurso";

const PCI_URL = "https://www.pciconcursos.com.br/concursos/";

const ownText = (el: cheerio.Cheerio<any>) =>
  el.clone().children().remove().end().text().trim();

export const parsePci = (html: string): ScrapedConcurso[] => {
  const $ = cheerio.load(html);

  return $(".ca")
    .map((_, el) => {
      const $el = $(el);
      const link = $el.find("a").first();
      const cd = $el.find(".cd");

      return {
        source: "pci",
        orgao: link.text().trim(),
        url: link.attr("href"),
        uf: $el.find(".cc").text().trim() || null,
        vagasSalario: ownText(cd),
        cargos: ownText(cd.children("span").first()),
        escolaridade: cd.find("span span").text().trim(),
        prazo: $el.find(".ce").text().trim(),
      };
    })
    .get();
};

export const scrapePci = async (): Promise<ScrapedConcurso[]> => {
  const res = await fetch(PCI_URL);
  return parsePci(await res.text());
};
