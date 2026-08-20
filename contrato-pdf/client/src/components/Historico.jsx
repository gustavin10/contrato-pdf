import { api } from '../api';

const NOMES_TEMPLATE = {
  prestacao_servico: 'Prestação de Serviço',
  freelance: 'Freelance'
};

export default function Historico({ contratos }) {
  if (contratos.length === 0) {
    return (
      <div className="panel">
        <div className="panel-title">Histórico</div>
        <p className="vazio">Nenhum contrato gerado ainda. Preencha o formulário acima para criar o primeiro.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-title">Histórico ({contratos.length})</div>
      <ul className="historico">
        {contratos.map((c) => (
          <li key={c.id}>
            <div className="historico-info">
              <div className="historico-titulo">{c.parte_contratante} → {c.parte_contratada}</div>
              <div className="historico-meta mono">
                {NOMES_TEMPLATE[c.template] || c.template} · {new Date(c.criado_em).toLocaleString('pt-BR')}
              </div>
            </div>
            <a className="btn-secondary" href={api.urlDownload(c.id)} target="_blank" rel="noopener noreferrer">
              Baixar PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
