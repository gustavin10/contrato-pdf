// Conexão com o banco SQLite e criação da tabela, caso não exista.
// Usamos better-sqlite3: síncrono, rápido, sem servidor separado —
// ideal para um projeto pequeno que roda em um único arquivo .db.

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'contratos.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS contratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template TEXT NOT NULL,
    parte_contratante TEXT NOT NULL,
    parte_contratada TEXT NOT NULL,
    servico TEXT NOT NULL,
    valor TEXT NOT NULL,
    prazo TEXT NOT NULL,
    condicoes TEXT,
    arquivo TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
