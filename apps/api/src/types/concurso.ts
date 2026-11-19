export type EditalLink = { title: string; url: string };

export type Relevance = "ti" | "maybe" | "no";

export type NoticiaDetails = { editais: EditalLink[]; text: string };

export type ScrapedConcurso = {
  source: string; // "pci"...
  orgao: string;
  url: string | undefined;
  uf: string | null;
  vagasSalario: string;
  cargos: string;
  escolaridade: string;
  prazo: string;
  relevance?: Relevance;
  editais?: EditalLink[];
};
