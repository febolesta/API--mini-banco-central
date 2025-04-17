const readline = require('readline');
const axios = require('axios');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pergunta(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function criarInstituicao() {
  try {
    const nome = await pergunta("Qual o nome da instituição? ");
    
    const resposta = await axios.post('http://localhost:3000/instituicoes', { nome: nome });
    
    console.log(resposta.data);
  } catch (erro) {
    console.error("Erro ao criar instituição:", erro.response ? erro.response.data : erro.message);
  }
}

async function criarConta() {
  try {
    const usuarioId = await pergunta("Qual o ID do usuário? ");
    const instituicao = await pergunta("Qual a instituição? ");
    const saldo = await pergunta("Qual o saldo inicial? ");
    
    const resposta = await axios.post(`http://localhost:3000/contas/${usuarioId}`, {
      instituicao: instituicao,
      saldo: parseFloat(saldo)
    });
    
    console.log(resposta.data);
  } catch (erro) {
    console.error("Erro ao criar conta:", erro.response ? erro.response.data : erro.message);
  }
}

async function adicionarTransacao() {
  try {
    const usuarioId = await pergunta("Qual o ID do usuário? ");
    const valor = await pergunta("Qual o valor da transação? ");
    const tipo = await pergunta("É crédito ou débito? ");
    const instituicao = await pergunta("Qual a instituição? ");
    
    const resposta = await axios.post(`http://localhost:3000/transacoes/${usuarioId}`, {
      valor: parseFloat(valor),
      tipo: tipo.toLowerCase(),
      instituicao: instituicao
    });
    
    console.log(resposta.data);
  } catch (erro) {
    console.error("Erro ao adicionar transação:", erro.response ? erro.response.data : erro.message);
  }
}

async function verSaldo() {
  try {
    const usuarioId = await pergunta("Qual o ID do usuário? ");
    
    const resposta = await axios.get(`http://localhost:3000/contas/${usuarioId}/saldo`);
    console.log("Saldo Total: ", resposta.data.saldoTotal);
  } catch (erro) {
    console.error("Erro ao consultar saldo:", erro.response ? erro.response.data : erro.message);
  }
}

async function verExtrato() {
  try {
    const usuarioId = await pergunta("Qual o ID do usuário? ");
    const instituicao = await pergunta("Filtrar extrato por instituição? (Deixe em branco para todos) ");
    
    let url = `http://localhost:3000/contas/${usuarioId}/extrato`;
    if (instituicao) {
      url += `?instituicao=${instituicao}`;
    }
    
    const resposta = await axios.get(url);
    console.log("Extrato: ", resposta.data);
  } catch (erro) {
    console.error("Erro ao consultar extrato:", erro.response ? erro.response.data : erro.message);
  }
}

async function menu() {
  const opcao = await pergunta(`
  O que você deseja fazer?
  1. Criar Instituição
  2. Criar Conta
  3. Adicionar Transação
  4. Ver Saldo
  5. Ver Extrato
  6. Sair
  Escolha uma opção (1-6): `);

  switch (opcao) {
    case '1':
      await criarInstituicao();
      break;
    case '2':
      await criarConta();
      break;
    case '3':
      await adicionarTransacao();
      break;
    case '4':
      await verSaldo();
      break;
    case '5':
      await verExtrato();
      break;
    case '6':
      console.log("Saindo...");
      rl.close();
      return;
    default:
      console.log("Opção inválida!");
  }

  menu(); 
}

menu();
