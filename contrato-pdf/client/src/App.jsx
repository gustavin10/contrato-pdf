import { useEffect, useState } from 'react';
import { api } from './api';
import ContratoForm from './components/ContratoForm';
import ContratoPreview from './components/ContratoPreview';
import Historico from './components/Historico';
import './styles.css';

const VAZIO = {
  template: 'prestacao_servico',
  parteContratante: '',
  parteContratada: '',
  servico: '',
  valor: '',
  prazo: '',
  condicoes: ''
};

export default function App() {
  const [templates, setTemplates] = useState([]);
  const [dados, setDados] = useState(VAZIO);
  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    api.listarTemplates().then(setTemplates).catch(() => setErro('Não foi possível conectar ao servidor.'));
    carregarHistorico();
  }, []);

  function carregarHistorico() {
    api.listarContratos().then(setContratos).catch(() => {});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);
    try {
      const resultado = await api.criarContrato(dados);
      setAviso('Contrato gerado com sucesso.');
      carregarHistorico();
      window.open(api.urlDownload(resultado.id), '_blank');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app">
      <header className="topo">
        <div className="marca">
          <span className="marca-nome">Gerador de Contrato<span className="dot">.</span></span>
          <span className="marca-sub mono">Preencha, visualize e baixe em PDF</span>
        </div>
        <a className="link-repo" href="https://github.com/SEU-USUARIO/contrato-pdf" target="_blank" rel="noopener noreferrer">
          Ver código no GitHub ↗
        </a>
      </header>

      {erro && <div className="banner erro">{erro}</div>}
      {aviso && <div className="banner ok">{aviso}</div>}

      <main className="grid">
        <ContratoForm
          templates={templates}
          dados={dados}
          onChange={setDados}
          onSubmit={handleSubmit}
          carregando={carregando}
        />
        <ContratoPreview templateId={dados.template} dados={dados} />
      </main>

      <Historico contratos={contratos} />

      <footer className="rodape mono">
        Projeto de portfólio — React + Node/Express + SQLite + pdfkit
      </footer>
    </div>
  );
}
