const { instituicoes, usuarios, contas, transacoes } = require("../data/database");

const criarInstituicao = (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).send("Nome da instituição é obrigatório");
  }
  instituicoes.push({ nome });
  res.status(201).send("Instituição criada");
};

const criarConta = (req, res) => {
  const usuarioId = req.params.id;
  const { instituicao, saldo } = req.body;

  if (!instituicao || saldo == null) {
    return res.status(400).send("Instituição e saldo são obrigatórios");
  }

  const conta = { usuarioId, instituicao, saldo };
  contas.push(conta);
  res.status(201).json({ mensagem: "Conta criada com sucesso!", conta });
};

const adicionarTransacao = (req, res) => {
  const usuarioId = req.params.id;
  const { valor, tipo, instituicao } = req.body;

  if (valor == null || !tipo || !instituicao) {
    return res.status(400).send("Valor, tipo e instituição são obrigatórios");
  }

  const transacao = { usuarioId, valor, tipo, instituicao };
  transacoes.push(transacao);
  res.status(201).json({ mensagem: "Transação adicionada", transacao });
};

const verSaldo = (req, res) => {
  const usuarioId = req.params.id;
  const saldoTotal = contas
    .filter(conta => conta.usuarioId === usuarioId)
    .reduce((total, conta) => total + conta.saldo, 0);

  if (saldoTotal === 0) {
    return res.status(404).send("Usuário não tem contas cadastradas");
  }

  res.status(200).json({ saldoTotal });
};


const verExtrato = (req, res) => {
  const usuarioId = req.params.id;
  const instituicaoFiltro = req.query.instituicao;
  
  const extrato = transacoes.filter(transacao => 
    transacao.usuarioId === usuarioId && 
    (!instituicaoFiltro || transacao.instituicao === instituicaoFiltro)
  );

  if (extrato.length === 0) {
    return res.status(404).send("Nenhuma transação encontrada");
  }

  res.status(200).json(extrato);
};

module.exports = { criarInstituicao, criarConta, adicionarTransacao, verSaldo, verExtrato };
