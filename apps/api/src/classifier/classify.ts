import type {
  NoticiaDetails,
  Relevance,
  ScrapedConcurso,
} from "../types/concurso.js";

// Strong match: goes straight to "ti"
const STRONG = [
  /inform[aá]tica/i,
  /tecnologia da informa[cç][aã]o/i,
  /\bTIC?\b/,
  /analista de sistemas/i,
  /programador/i,
  /engenh\w+ de (software|dados)/i,
  /seguran[cç]a da informa/i,
];

// Weak match: "maybe"
const WEAK = [/desenvolv/i, /dados/i, /redes/i, /suporte/i, /sistemas/i];

const VARIOS_CARGOS = /v[aá]rios cargos/i;
const SUPERIOR = /superior/i;

const matches = (patterns: RegExp[], text: string) =>
  patterns.some((re) => re.test(text));

export const isTI = (text: string) => matches(STRONG, text);

// First pass: listing data only
export const classify = (c: ScrapedConcurso): Relevance => {
  if (isTI(c.cargos)) return "ti";
  if (matches(WEAK, c.cargos)) return "maybe";
  if (VARIOS_CARGOS.test(c.cargos) && SUPERIOR.test(c.escolaridade))
    return "maybe";
  return "no";
};

// Second pass: promotes "maybe" when the news text mentions an IT role
export const refineWithDetails = (
  current: Relevance,
  details: NoticiaDetails,
): Relevance => (current === "maybe" && isTI(details.text) ? "ti" : current);
