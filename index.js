const express = require('express');
const app = express();
app.use(express.json());

let instituicoes = [];
let usuarios = [];
let contas = [];
let transacoes = [];

let idInstituicao = 1;
let idUsuario = 1;
let idConta = 1;
let idTransacao = 1;

// Criar instituição
app.post('/instituicoes', (req, res) => {
  const { nome } = req.body;
  const nova = { id: idInstituicao++, nome };
  instituicoes.push(nova);
  res.status(201).json(nova);
});

// Criar usuário
app.post('/usuarios', (req, res) => {
  const { nome } = req.body;
  const novo = { id: idUsuario++, nome };
  usuarios.push(novo);
  res.status(201).json(novo);
});

// Criar conta
app.post('/usuarios/:id/contas', (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const { instituicaoId } = req.body;
  const novaConta = { id: idConta++, usuarioId, instituicaoId, saldo: 0 };
  contas.push(novaConta);
  res.status(201).json(novaConta);
});

// Adicionar transação
app.post('/usuarios/:id/transacoes', (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const { contaId, tipo, valor } = req.body;

  const conta = contas.find(c => c.id === contaId && c.usuarioId === usuarioId);
  if (!conta) return res.status(404).json({ erro: 'Conta não encontrada' });

  if (tipo === 'credito') conta.saldo += valor;
  else if (tipo === 'debito') conta.saldo -= valor;
  else return res.status(400).json({ erro: 'Tipo inválido' });

  const novaTransacao = {
    id: idTransacao++,
    contaId,
    tipo,
    valor,
    data: new Date()
  };
  transacoes.push(novaTransacao);
  res.status(201).json(novaTransacao);
});

// Ver saldo total ou por instituição
app.get('/usuarios/:id/saldo', (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const filtro = req.query.instituicao;

  const contasUsuario = contas.filter(c => c.usuarioId === usuarioId);
  if (filtro) {
    const instituicao = instituicoes.find(i => i.nome === filtro);
    if (!instituicao) return res.status(404).json({ erro: 'Instituição não encontrada' });
    const contasFiltradas = contasUsuario.filter(c => c.instituicaoId === instituicao.id);
    const saldo = contasFiltradas.reduce((s, c) => s + c.saldo, 0);
    return res.json({ saldo });
  }

  const saldoTotal = contasUsuario.reduce((s, c) => s + c.saldo, 0);
  res.json({ saldo: saldoTotal });
});

// Ver extrato completo ou por instituição
app.get('/usuarios/:id/extrato', (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const filtro = req.query.instituicao;

  const contasUsuario = contas.filter(c => c.usuarioId === usuarioId);

  let contasFiltradas = contasUsuario;
  if (filtro) {
    const instituicao = instituicoes.find(i => i.nome === filtro);
    if (!instituicao) return res.status(404).json({ erro: 'Instituição não encontrada' });
    contasFiltradas = contasUsuario.filter(c => c.instituicaoId === instituicao.id);
  }

  const ids = contasFiltradas.map(c => c.id);
  const extrato = transacoes.filter(t => ids.includes(t.contaId));
  res.json({ extrato });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});