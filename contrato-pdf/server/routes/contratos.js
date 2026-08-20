const express = require('express');
const path = require('path');
const db = require('../db/database');
const { TEMPLATES } = require('../templates/templates');
const { gerarPdf, PASTA_SAIDA } = require('../pdf/gerarPdf');

const router = express.Router();

function validar(body) {
  const obrigatorios = ['template', 'parteContratante', 'parteContratada', 'servico', 'valor', 'prazo'];
  const faltando = obrigatorios.filter((campo) => !body[campo] || String(body[campo]).trim() === '');
  if (faltando.length > 0) {
    return `Campos obrigatórios ausentes: ${faltando.join(', ')}`;
  }
  if (!TEMPLATES[body.template]) {
    return `Template "${body.template}" não existe.`;
  }
  return null;
}

// GET /api/templates — lista os modelos disponíveis para o formulário
router.get('/templates', (req, res) => {
  const lista = Object.values(TEMPLATES).map((t) => ({ id: t.id, nome: t.nome }));
  res.json(lista);
});

// POST /api/contratos — gera um novo contrato em PDF e salva no histórico
router.post('/contratos', async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const { template, parteContratante, parteContratada, servico, valor, prazo, condicoes } = req.body;

  try {
    const conteudo = TEMPLATES[template].gerar({
      parteContratante, parteContratada, servico, valor, prazo, condicoes
    });

    const arquivo = await gerarPdf(conteudo);

    const stmt = db.prepare(`
      INSERT INTO contratos (template, parte_contratante, parte_contratada, servico, valor, prazo, condicoes, arquivo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(template, parteContratante, parteContratada, servico, valor, prazo, condicoes || '', arquivo);

    res.status(201).json({
      id: info.lastInsertRowid,
      arquivo,
      url: `/api/contratos/${info.lastInsertRowid}/download`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao gerar o PDF do contrato.' });
  }
});

// GET /api/contratos — histórico, mais recentes primeiro
router.get('/contratos', (req, res) => {
  const linhas = db.prepare('SELECT * FROM contratos ORDER BY id DESC').all();
  res.json(linhas);
});

// GET /api/contratos/:id/download — baixa o PDF já gerado
router.get('/contratos/:id/download', (req, res) => {
  const linha = db.prepare('SELECT * FROM contratos WHERE id = ?').get(req.params.id);
  if (!linha) return res.status(404).json({ erro: 'Contrato não encontrado.' });

  const caminho = path.join(PASTA_SAIDA, linha.arquivo);
  res.download(caminho, linha.arquivo);
});

module.exports = router;
