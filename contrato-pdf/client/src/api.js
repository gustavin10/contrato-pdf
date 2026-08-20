// Em produção, defina VITE_API_URL no ambiente do Vercel apontando
// para a URL pública do back-end no Railway. Em desenvolvimento,
// cai automaticamente em localhost:3333.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.erro || `Erro na requisição (${res.status})`);
  }
  return res.json();
}

export const api = {
  listarTemplates: () => request('/api/templates'),
  listarContratos: () => request('/api/contratos'),
  criarContrato: (dados) =>
    request('/api/contratos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }),
  urlDownload: (id) => `${BASE_URL}/api/contratos/${id}/download`
};
