import { describe, it, expect } from "vitest";
import { parsePci } from "./pci";

// Fixture: concurso nacional (sem UF), igual ao HTML real da PCI
const nacional = `
<div class="ca">
  <a href="https://www.pciconcursos.com.br/noticias/camara-dos-deputados">Câmara dos Deputados</a>
  <div class="cb"><img src="logo.png"></div>
  <div class="cc">&nbsp;</div>
  <div class="cd">184 vagas até R$ 32.070,88<br><span>Analista Legislativo, Engenheiro, Museólogo<br><span>Superior</span></span></div>
  <div class="ce"><span>17/11/2026</span></div>
  <div class="clear"></div>
</div>`;

// Fixture: concurso estadual (com UF)
const estadual = `
<div class="ca">
  <a href="https://www.pciconcursos.com.br/noticias/prefeitura-de-leme">Prefeitura de Leme</a>
  <div class="cb"><img src="logo.png"></div>
  <div class="cc">SP</div>
  <div class="cd">29 vagas até R$ 13.359,44<br><span>Vários Cargos<br><span>Fundamental / Médio / Técnico / Superior</span></span></div>
  <div class="ce"><span>30/11/2026</span></div>
  <div class="clear"></div>
</div>`;

describe("parsePci", () => {
  it("extrai todos os campos de um concurso nacional", () => {
    const [concurso] = parsePci(nacional);

    expect(concurso).toEqual({
      source: "pci",
      orgao: "Câmara dos Deputados",
      url: "https://www.pciconcursos.com.br/noticias/camara-dos-deputados",
      uf: null,
      vagasSalario: "184 vagas até R$ 32.070,88",
      cargos: "Analista Legislativo, Engenheiro, Museólogo",
      escolaridade: "Superior",
      prazo: "17/11/2026",
    });
  });

  it("lê a UF de um concurso estadual", () => {
    const [concurso] = parsePci(estadual);

    expect(concurso.uf).toBe("SP");
    expect(concurso.cargos).toBe("Vários Cargos");
  });

  it("encontra todos os concursos da página", () => {
    const html = `<div>${nacional}${estadual}</div>`;

    expect(parsePci(html)).toHaveLength(2);
  });

  it("devolve lista vazia quando não há concursos", () => {
    expect(parsePci("<html><body>nada aqui</body></html>")).toEqual([]);
  });
});
