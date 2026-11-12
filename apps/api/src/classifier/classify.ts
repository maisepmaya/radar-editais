import { ScrapedConcurso } from "../types/concurso";

// certeza: vai direto como TI
const STRONG = [
  /inform[aá]tica/i,
  /tecnologia da informa[cç][aã]o/i,
  /\bTIC?\b/,
  /analista de sistemas/i,
  /programador/i,
  /engenh\w+ de (software|dados)/i,
  /seguran[cç]a da informa/i,
];

// suspeita: a IA confere depois
const WEAK = [/desenvolv/i, /dados/i, /redes/i, /suporte/i, /sistemas/i];

const matches = (list: RegExp[], text: string) =>
  list.some((re) => re.test(text));

export type Relevance = "ti" | "maybe" | "no";

export const classify = (c: ScrapedConcurso): Relevance => {
  if (matches(STRONG, c.cargos)) return "ti";
  if (matches(WEAK, c.cargos)) return "maybe";
  if (/v[aá]rios cargos/i.test(c.cargos) && /superior/i.test(c.escolaridade))
    return "maybe";
  return "no";
};
