// Gera o texto de preview no navegador, espelhando os templates do
// back-end (server/templates/templates.js). O PDF final é sempre
// gerado no servidor — isso aqui é só para o usuário ver o resultado
// antes de baixar, sem precisar de uma requisição a cada tecla digitada.

function moeda(valor) {
  const n = Number(String(valor).replace(',', '.'));
  if (Number.isNaN(n) || valor === '') return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const GERADORES = {
  prestacao_servico: (d) => ({
    titulo: 'Contrato de Prestação de Serviços',
    blocos: [
      ['Das partes', `${d.parteContratante || '[contratante]'} (CONTRATANTE) e ${d.parteContratada || '[contratado]'} (CONTRATADO/A).`],
      ['Cláusula 1ª — Do objeto', `Prestação do serviço: ${d.servico || '[serviço]'}.`],
      ['Cláusula 2ª — Do valor', `Valor total: ${moeda(d.valor)}.`],
      ['Cláusula 3ª — Do prazo', `Prazo de execução: ${d.prazo || '[prazo]'}.`],
      ['Cláusula 4ª — Condições gerais', d.condicoes || 'Sem condições adicionais.']
    ]
  }),
  freelance: (d) => ({
    titulo: 'Contrato de Prestação de Serviços Freelance',
    blocos: [
      ['Das partes', `${d.parteContratante || '[cliente]'} (CLIENTE) contrata ${d.parteContratada || '[freelancer]'} (FREELANCER).`],
      ['Escopo do trabalho', d.servico || '[descrição do trabalho]'],
      ['Valor e pagamento', `Valor total: ${moeda(d.valor)}.`],
      ['Prazo de entrega', `Entrega em: ${d.prazo || '[prazo]'}.`],
      ['Revisões e condições', d.condicoes || 'Sem condições adicionais.']
    ]
  })
};

export function gerarPreview(templateId, dados) {
  const gerar = GERADORES[templateId] || GERADORES.prestacao_servico;
  return gerar(dados);
}
