export default function ContratoForm({ templates, dados, onChange, onSubmit, carregando }) {
  function set(campo, valor) {
    onChange({ ...dados, [campo]: valor });
  }

  return (
    <form className="panel form" onSubmit={onSubmit}>
      <div className="panel-title">Dados do contrato</div>

      <label className="campo">
        <span>Modelo</span>
        <div className="template-picker">
          {templates.map((t) => (
            <button
              type="button"
              key={t.id}
              className={'tpl-btn' + (dados.template === t.id ? ' on' : '')}
              onClick={() => set('template', t.id)}
            >
              {t.nome}
            </button>
          ))}
        </div>
      </label>

      <label className="campo">
        <span>Parte contratante</span>
        <input
          value={dados.parteContratante}
          onChange={(e) => set('parteContratante', e.target.value)}
          placeholder="Empresa Exemplo LTDA"
          required
        />
      </label>

      <label className="campo">
        <span>Parte contratada</span>
        <input
          value={dados.parteContratada}
          onChange={(e) => set('parteContratada', e.target.value)}
          placeholder="Seu nome ou empresa"
          required
        />
      </label>

      <label className="campo">
        <span>Serviço prestado</span>
        <textarea
          value={dados.servico}
          onChange={(e) => set('servico', e.target.value)}
          placeholder="Descreva o serviço a ser prestado"
          rows={3}
          required
        />
      </label>

      <div className="campo-linha">
        <label className="campo">
          <span>Valor (R$)</span>
          <input
            value={dados.valor}
            onChange={(e) => set('valor', e.target.value)}
            placeholder="1500"
            inputMode="decimal"
            required
          />
        </label>

        <label className="campo">
          <span>Prazo</span>
          <input
            value={dados.prazo}
            onChange={(e) => set('prazo', e.target.value)}
            placeholder="30 dias"
            required
          />
        </label>
      </div>

      <label className="campo">
        <span>Condições adicionais <em>(opcional)</em></span>
        <textarea
          value={dados.condicoes}
          onChange={(e) => set('condicoes', e.target.value)}
          placeholder="Pagamento em duas parcelas, revisões incluídas, etc."
          rows={3}
        />
      </label>

      <button type="submit" className="btn-primary" disabled={carregando}>
        {carregando ? 'Gerando PDF…' : 'Gerar contrato em PDF'}
      </button>
    </form>
  );
}
