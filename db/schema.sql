CREATE TABLE IF NOT EXISTS concursos (
  id            SERIAL PRIMARY KEY,
  url           TEXT NOT NULL UNIQUE,
  source        TEXT NOT NULL,
  orgao         TEXT NOT NULL,
  uf            TEXT,
  vagas_salario TEXT,
  cargos        TEXT,
  escolaridade  TEXT,
  prazo         TEXT,
  relevance     TEXT NOT NULL CHECK (relevance IN ('ti','maybe','no')),
  editais       JSONB NOT NULL DEFAULT '[]',
  status        TEXT NOT NULL DEFAULT 'aberto',
  data_prova    DATE,
  ai_read_at    TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);