export type ScrapedConcurso = {
  source: string; // "pci", "acheconcursos"...
  orgao: string;
  url: string | undefined;
  uf: string | null;
  vagasSalario: string;
  cargos: string;
  escolaridade: string;
  prazo: string;
};
