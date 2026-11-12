import { classify } from "../classifier/classify.js";
import { scrapePci } from "./pci.js";

const sources = {
  pci: scrapePci,
};

const only = process.argv[2]; // ex: npm run scrape -- pci

for (const [name, scrape] of Object.entries(sources)) {
  if (only && only !== name) continue;
  console.log(`▶ ${name}`);
  const lista = await scrape();
  const ti = lista.filter((c) => classify(c) === "ti");
  const maybe = lista.filter((c) => classify(c) === "maybe");
  console.log(
    `[${name}] ${lista.length} total | ${ti.length} TI | ${maybe.length} talvez`,
  );
  console.log(ti);
}
