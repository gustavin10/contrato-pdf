const express = require('express');
const cors = require('cors');
const contratosRouter = require('./routes/contratos');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', contratosRouter);

app.listen(PORT, () => {
  console.log(`Servidor do gerador de contrato rodando em http://localhost:${PORT}`);
});
