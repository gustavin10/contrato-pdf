// Popula o banco com um contrato de exemplo já gerado, para que quem
// visitar o app em produção veja o histórico funcionando e possa
// baixar um PDF de exemplo sem precisar preencher nada primeiro.
//
// Uso: node seed.js

const db = require('./db/database');
const { TEMPLATES } = require('./templates/templates');
const { gerarPdf } = require('./pdf/gerarPdf');

async function seed() {
  const existente = db.prepare('SELECT COUNT(*) AS n FROM contratos').get();
  if (existente.n > 0) {
    console.log('Banco já contém contratos — seed não é necessário.');
    return;
  }

  const dados = {
    parteContratante: 'Estúdio Nortada Design',
    parteContratada: 'Gustavo Milhomem',
    servico: 'Desenvolvimento de landing page institucional em React, com formulário de contato integrado.',
    valor: '2400',
    prazo: '15 dias corridos',
    condicoes: 'O pagamento será dividido em duas parcelas: 50% na assinatura e 50% na entrega. Até duas rodadas de ajustes estão incluídas no valor.'
  };

  const conteudo = TEMPLATES.freelance.gerar(dados);
  const arquivo = await gerarPdf(conteudo);

  db.prepare(`
    INSERT INTO contratos (template, parte_contratante, parte_contratada, servico, valor, prazo, condicoes, arquivo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('freelance', dados.parteContratante, dados.parteContratada, dados.servico, dados.valor, dados.prazo, dados.condicoes, arquivo);

  console.log('Contrato de exemplo criado:', arquivo);
}

seed().catch((e) => {
  console.error('Falha ao popular o banco:', e);
  process.exit(1);
});
