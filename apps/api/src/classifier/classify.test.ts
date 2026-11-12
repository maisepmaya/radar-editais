import { describe, it, expect } from "vitest";
import { classify } from "./classify.js";
import type { ScrapedConcurso } from "../types/concurso.js";

// cria um concurso "falso" só com o que importa pro teste
const make = (cargos: string, escolaridade = "Superior"): ScrapedConcurso => ({
  source: "test",
  orgao: "Órgão Teste",
  url: undefined,
  uf: "PE",
  vagasSalario: "",
  cargos,
  escolaridade,
  prazo: "",
});

describe("classify", () => {
  it.each([
    // [cargos, escolaridade, esperado]
    ["Analista de Tecnologia da Informação", "Superior", "ti"],
    ["Técnico em Informática", "Técnico", "ti"],
    ["Programador", "Superior", "ti"],
    ["Auxiliar de Desenvolvimento Infantil", "Médio", "maybe"],
    ["Vários Cargos", "Médio / Superior", "maybe"],
    ["Vários Cargos", "Fundamental / Médio", "no"],
    ["Professor, Enfermeiro", "Superior", "no"],
  ])('"%s" (%s) → %s', (cargos, escolaridade, expected) => {
    expect(classify(make(cargos, escolaridade))).toBe(expected);
  });
});
