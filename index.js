const express = require('express');
const app = express();
const client = require('./data/database'); 

app.use(express.json());

app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (resultado.rows.length) {
      res.json(resultado.rows[0]);
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
});

app.post('/usuarios/:id/transacoes', async (req, res) => {
  const { id } = req.params;
  const { instituicao, tipo, valor } = req.body;

  try {
    const resultadoConta = await client.query(
      'SELECT * FROM contas WHERE usuario_id = $1 AND instituicao = $2',
      [id, instituicao]
    );

    if (resultadoConta.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Conta não encontrada para esse usuário e instituição' });
    }

    const contaId = resultadoConta.rows[0].id;
    const novaTransacao = tipo === 'credito' ? valor : -valor;

    await client.query(
      'UPDATE contas SET saldo = saldo + $1 WHERE id = $2',
      [novaTransacao, contaId]
    );

    await client.query(
      'INSERT INTO transacoes (conta_id, tipo, valor) VALUES ($1, $2, $3)',
      [contaId, tipo, valor]
    );

    res.json({ mensagem: 'Transação realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao realizar transação' });
  }
});

app.get('/usuarios/:id/saldo', async (req, res) => {
  const { id } = req.params;
  const { instituicao } = req.query;

  try {
    let query = 'SELECT SUM(saldo) AS saldo_total FROM contas WHERE usuario_id = $1';
    let values = [id];

    if (instituicao) {
      query += ' AND instituicao = $2';
      values.push(instituicao);
    }

    const resultado = await client.query(query, values);
    res.json({ saldo_total: resultado.rows[0].saldo_total });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter saldo' });
  }
});

app.get('/usuarios/:id/extrato', async (req, res) => {
  const { id } = req.params;
  const { instituicao } = req.query;

  try {
    let query = 'SELECT * FROM transacoes t JOIN contas c ON t.conta_id = c.id WHERE c.usuario_id = $1';
    let values = [id];

    if (instituicao) {
      query += ' AND c.instituicao = $2';
      values.push(instituicao);
    }

    const resultado = await client.query(query, values);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter extrato' });
  }
});

app.post('/usuarios/:id/contas', async (req, res) => {
  const { id } = req.params;
  const { instituicao, saldo } = req.body;

  try {
    const resultado = await client.query(
      'INSERT INTO contas (usuario_id, instituicao, saldo) VALUES ($1, $2, $3) RETURNING *',
      [id, instituicao, saldo]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar conta' });
  }
});

app.post('/instituicoes', async (req, res) => {
  const { nome } = req.body;

  try {
    const resultado = await client.query(
      'INSERT INTO instituicoes (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar instituição' });
  }
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
