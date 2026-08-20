import { gerarPreview } from '../preview';

export default function ContratoPreview({ templateId, dados }) {
  const preview = gerarPreview(templateId, dados);

  return (
    <div className="panel preview">
      <div className="panel-title">Preview</div>
      <div className="folha">
        <h3>{preview.titulo}</h3>
        <div className="folha-data mono">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</div>
        <hr />
        {preview.blocos.map(([titulo, texto]) => (
          <div className="folha-bloco" key={titulo}>
            <div className="folha-titulo">{titulo}</div>
            <p>{texto}</p>
          </div>
        ))}
        <div className="folha-assinaturas">
          <div><span>_______________________</span><small>CONTRATANTE</small></div>
          <div><span>_______________________</span><small>CONTRATADO(A)</small></div>
        </div>
      </div>
    </div>
  );
}
