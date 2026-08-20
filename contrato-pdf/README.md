# Gerador de Contrato em PDF

Aplicação full stack que gera contratos personalizados em PDF a partir de um formulário. O usuário escolhe um modelo, preenche os dados, vê um preview em tempo real e baixa o documento pronto — com histórico dos contratos já gerados.

**[→ Testar em produção](#)** · **[→ Ver repositório](#)**

---

## Stack

| Camada        | Tecnologia                              |
|---------------|------------------------------------------|
| Front-end     | React (Vite)                              |
| Back-end      | Node.js + Express                         |
| Banco de dados| SQLite via `better-sqlite3`               |
| Geração de PDF| `pdfkit`                                  |

## Por que essas escolhas

**SQLite em vez de PostgreSQL.** O projeto não precisa de múltiplos usuários simultâneos gravando no mesmo banco — é um histórico local de contratos. SQLite guarda tudo em um único arquivo, sem servidor de banco separado para configurar, o que simplifica tanto o desenvolvimento quanto o deploy.

**`better-sqlite3` em vez de um ORM.** A biblioteca é síncrona e usa bindings nativos, sem a etapa de baixar binários de um serviço externo (como o motor de query do Prisma). Para um schema pequeno como este — uma tabela só — escrever o SQL diretamente também deixa claro exatamente o que está sendo salvo, sem uma camada de abstração no meio.

**`pdfkit` em vez de um gerador baseado em navegador (Puppeteer).** `pdfkit` é uma biblioteca puramente em JavaScript: não precisa baixar nem controlar um Chromium inteiro só para desenhar um documento. Isso deixa o processo de geração mais leve em memória — importante em planos de deploy gratuitos — e dá controle explícito sobre o posicionamento de cada bloco de texto.

## Estrutura do projeto

```
contrato-pdf/
├── server/                  # API (Node + Express)
│   ├── db/
│   │   └── database.js      # conexão SQLite e criação da tabela
│   ├── templates/
│   │   └── templates.js     # texto dos modelos de contrato
│   ├── pdf/
│   │   └── gerarPdf.js       # desenha o PDF a partir do template
│   ├── routes/
│   │   └── contratos.js     # rotas da API
│   ├── generated/            # PDFs gerados (ignorado no git)
│   ├── seed.js               # popula o banco com um contrato de exemplo
│   └── index.js              # servidor Express
│
└── client/                  # Front-end (React + Vite)
    └── src/
        ├── components/
        │   ├── ContratoForm.jsx
        │   ├── ContratoPreview.jsx
        │   └── Historico.jsx
        ├── api.js            # chamadas à API
        ├── preview.js         # espelha os templates só para o preview
        └── App.jsx
```

## Rodando localmente

Pré-requisito: Node.js 18 ou superior.

### 1. Back-end

```bash
cd server
npm install
npm run dev
```

O servidor sobe em `http://localhost:3333`. Na primeira execução, o arquivo `db/contratos.db` é criado automaticamente.

Opcional — popular o histórico com um contrato de exemplo:

```bash
npm run seed
```

### 2. Front-end

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

O app abre em `http://localhost:5173` e já aponta para o back-end local.

## Variáveis de ambiente

O front-end usa `VITE_API_URL` para saber onde está a API. Em desenvolvimento local pode deixar em branco (usa `localhost:3333` por padrão). Veja `client/.env.example`.

## Deploy

- **Back-end (Railway):** crie um novo projeto apontando para a pasta `server/`, defina o comando de start como `npm start` e rode `npm run seed` uma vez após o primeiro deploy para popular o histórico de demonstração.
- **Front-end (Vercel):** aponte para a pasta `client/`, defina `VITE_API_URL` nas variáveis de ambiente do projeto com a URL pública gerada pelo Railway, e faça o deploy.

## Endpoints da API

| Método | Rota                          | Descrição                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/api/templates`              | Lista os modelos de contrato disponíveis |
| GET    | `/api/contratos`               | Lista o histórico de contratos gerados   |
| POST   | `/api/contratos`               | Gera um novo contrato em PDF             |
| GET    | `/api/contratos/:id/download`  | Baixa o PDF de um contrato específico    |

---

Projeto de portfólio desenvolvido por [Gustavo Milhomem](https://github.com/SEU-USUARIO).
