// Geração do PDF em si.
//
// Escolhi o pdfkit em vez de um gerador baseado em navegador (como
// puppeteer) por três motivos: (1) é uma biblioteca puramente em
// JavaScript, sem precisar baixar ou controlar um Chromium inteiro
// só para gerar um documento; (2) o processo de geração é muito mais
// leve em memória, o que importa em um plano de deploy gratuito;
// (3) o controle sobre o layout (posição de texto, fontes, quebras
// de página) é explícito, o que evita PDFs quebrados quando o
// conteúdo do usuário é maior que o esperado.

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const PASTA_SAIDA = path.join(__dirname, '..', 'generated');
if (!fs.existsSync(PASTA_SAIDA)) fs.mkdirSync(PASTA_SAIDA, { recursive: true });

function gerarNomeArquivo() {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `contrato-${ts}-${rand}.pdf`;
}

function gerarPdf({ titulo, blocos }) {
  return new Promise((resolve, reject) => {
    const nomeArquivo = gerarNomeArquivo();
    const caminho = path.join(PASTA_SAIDA, nomeArquivo);

    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    const stream = fs.createWriteStream(caminho);
    doc.pipe(stream);

    // Cabeçalho
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(titulo.toUpperCase(), { align: 'center' });

    doc.moveDown(0.3);
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#666666')
      .text(`Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.fillColor('#000000');
    doc.moveDown(1.6);

    // linha divisória
    doc.moveTo(56, doc.y).lineTo(539, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1.2);

    // Blocos de cláusulas
    blocos.forEach((bloco) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(bloco.titulo, { align: 'left' });
      doc.moveDown(0.35);
      doc
        .font('Helvetica')
        .fontSize(10.5)
        .fillColor('#1a1a1a')
        .text(bloco.texto, { align: 'justify', lineGap: 3 });
      doc.fillColor('#000000');
      doc.moveDown(1.1);
    });

    // Assinaturas
    doc.moveDown(1.5);
    const yAssinatura = doc.y;
    doc
      .fontSize(10)
      .text('_______________________________', 56, yAssinatura)
      .text('CONTRATANTE', 56, yAssinatura + 16);

    doc
      .fontSize(10)
      .text('_______________________________', 320, yAssinatura)
      .text('CONTRATADO(A)', 320, yAssinatura + 16);

    doc.end();

    stream.on('finish', () => resolve(nomeArquivo));
    stream.on('error', reject);
  });
}

module.exports = { gerarPdf, PASTA_SAIDA };
