import { classify, refineWithDetails } from "../classifier/classify.js";
import { scrapePci, fetchDetailsPci } from "./pci.js";
import { sleep } from "../utils/sleep.js";
import type {
  NoticiaDetails,
  Relevance,
  ScrapedConcurso,
} from "../types/concurso.js";

type Source = {
  scrape: () => Promise<ScrapedConcurso[]>;
  fetchDetails: (c: ScrapedConcurso) => Promise<NoticiaDetails>;
};

const sources: Record<string, Source> = {
  pci: { scrape: scrapePci, fetchDetails: fetchDetailsPci },
};

// Rate limit: 1 request per second
const DELAY_MS = 1000;

const enrich = async (
  name: string,
  source: Source,
  concursos: ScrapedConcurso[],
) => {
  for (const [i, c] of concursos.entries()) {
    try {
      const details = await source.fetchDetails(c);
      c.editais = details.editais;
      c.relevance = refineWithDetails(c.relevance ?? "maybe", details);
    } catch (err) {
      console.error(`[${name}] failed: ${c.orgao}`, err);
      c.editais = [];
    }
    console.log(
      `[${name}] ${i + 1}/${concursos.length} ${c.orgao}: ${c.relevance}`,
    );
    await sleep(DELAY_MS);
  }
};

const summarize = (name: string, listings: ScrapedConcurso[]) => {
  const stats = (r: Relevance) => {
    const group = listings.filter((c) => c.relevance === r);
    const editais = group.reduce((sum, c) => sum + (c.editais?.length ?? 0), 0);
    return `${group.length} concursos, ${editais} editais`;
  };

  console.log(`[${name}] ${listings.length} total`);
  console.log(` IT: ${stats("ti")}`);
  console.log(` Maybe: ${stats("maybe")}`);
};

// Optional CLI filter, e.g. `npm run scrape -- pci`
const only = process.argv[2];

for (const [name, source] of Object.entries(sources)) {
  if (only && only !== name) continue;
  console.log(`▶ ${name}`);

  const listings = await source.scrape();
  listings.forEach((c) => (c.relevance = classify(c)));

  await enrich(
    name,
    source,
    listings.filter((c) => c.relevance !== "no"),
  );
  summarize(name, listings);
}
