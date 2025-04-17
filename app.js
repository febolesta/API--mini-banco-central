const express = require('express');
const { criarInstituicao, criarConta, adicionarTransacao, verSaldo, verExtrato } = require('./controllers/bancoController');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/instituicoes', criarInstituicao);
app.post('/contas/:id', criarConta); 
app.post('/transacoes/:id', adicionarTransacao); 
app.get('/contas/:id/saldo', verSaldo);
app.get('/contas/:id/extrato', verExtrato);

app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
