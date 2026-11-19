const HEADERS = {
  "User-Agent":
    "RadarEditais/0.1 (+https://github.com/maisepmaya/radar-editais)",
};

export const fetchHtml = async (url: string): Promise<string> => {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
  return res.text();
};
