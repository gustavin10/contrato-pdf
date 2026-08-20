// Cada template retorna uma lista de blocos { titulo, texto }.
// O gerador de PDF (pdf/gerarPdf.js) percorre essa lista e desenha
// cada bloco na página. Adicionar um novo template = adicionar uma
// função nova aqui e registrá-la no objeto TEMPLATES no fim do arquivo.

function moeda(valor) {
  const n = Number(String(valor).replace(',', '.'));
  if (Number.isNaN(n)) return valor;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function prestacaoServico(dados) {
  const { parteContratante, parteContratada, servico, valor, prazo, condicoes } = dados;
  return {
    titulo: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS',
    blocos: [
      {
        titulo: 'DAS PARTES',
        texto:
          `Pelo presente instrumento particular, de um lado ${parteContratante}, ` +
          `doravante denominado(a) CONTRATANTE, e de outro lado ${parteContratada}, ` +
          `doravante denominado(a) CONTRATADO(A), têm entre si justo e acordado o ` +
          `presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas ` +
          `a seguir.`
      },
      {
        titulo: 'CLÁUSULA 1ª — DO OBJETO',
        texto: `O presente contrato tem como objeto a prestação do seguinte serviço: ${servico}.`
      },
      {
        titulo: 'CLÁUSULA 2ª — DO VALOR E FORMA DE PAGAMENTO',
        texto:
          `Pela prestação dos serviços descritos na Cláusula 1ª, o CONTRATANTE pagará ` +
          `ao CONTRATADO(A) o valor total de ${moeda(valor)}.`
      },
      {
        titulo: 'CLÁUSULA 3ª — DO PRAZO',
        texto: `O prazo para a execução dos serviços contratados é de ${prazo}.`
      },
      {
        titulo: 'CLÁUSULA 4ª — DAS CONDIÇÕES GERAIS',
        texto: condicoes && condicoes.trim().length > 0
          ? condicoes
          : 'Não foram estipuladas condições adicionais além das descritas neste contrato.'
      },
      {
        titulo: 'CLÁUSULA 5ª — DO FORO',
        texto:
          'Fica eleito o foro da comarca do CONTRATANTE para dirimir quaisquer dúvidas ' +
          'ou controvérsias oriundas deste contrato.'
      }
    ]
  };
}

function freelance(dados) {
  const { parteContratante, parteContratada, servico, valor, prazo, condicoes } = dados;
  return {
    titulo: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS FREELANCE',
    blocos: [
      {
        titulo: 'DAS PARTES',
        texto:
          `${parteContratante} (CLIENTE) contrata ${parteContratada} (FREELANCER) para a ` +
          `execução do trabalho abaixo especificado, em regime de prestação de serviço ` +
          `autônomo, sem vínculo empregatício.`
      },
      {
        titulo: 'ESCOPO DO TRABALHO',
        texto: `Descrição do trabalho a ser entregue: ${servico}.`
      },
      {
        titulo: 'VALOR E PAGAMENTO',
        texto:
          `O valor total acordado pelo trabalho é de ${moeda(valor)}. O pagamento ` +
          `poderá ser dividido em etapas, conforme combinado entre as partes.`
      },
      {
        titulo: 'PRAZO DE ENTREGA',
        texto: `O FREELANCER se compromete a entregar o trabalho no prazo de ${prazo}.`
      },
      {
        titulo: 'REVISÕES E CONDIÇÕES ADICIONAIS',
        texto: condicoes && condicoes.trim().length > 0
          ? condicoes
          : 'Não foram estipuladas condições adicionais além das descritas neste contrato.'
      },
      {
        titulo: 'PROPRIEDADE E USO',
        texto:
          'Após a quitação integral do valor acordado, todos os direitos sobre o material ' +
          'entregue são transferidos ao CLIENTE, salvo disposição em contrário registrada ' +
          'na cláusula de condições adicionais.'
      }
    ]
  };
}

const TEMPLATES = {
  prestacao_servico: {
    id: 'prestacao_servico',
    nome: 'Prestação de Serviço',
    gerar: prestacaoServico
  },
  freelance: {
    id: 'freelance',
    nome: 'Freelance',
    gerar: freelance
  }
};

module.exports = { TEMPLATES };
