# 🏦 Mini Banco Central – API REST

Esta é uma API REST simples que simula um agregador bancário, funcionando totalmente em memória (sem banco de dados), no estilo "Mini Banco Central". Permite consolidar informações de instituições financeiras, contas bancárias e transações associadas a usuários.

## ✅ Funcionalidades

- Criar instituições financeiras (`/instituicoes`)
- Criar usuários (`/usuarios`)
- Criar contas vinculadas a instituições e usuários (`/usuarios/:id/contas`)
- Adicionar transações (crédito ou débito) (`/usuarios/:id/transacoes`)
- Ver saldo total ou por instituição (`/usuarios/:id/saldo`)
- Ver extrato completo ou por instituição (`/usuarios/:id/extrato`)

## 🚀 Tecnologias Utilizadas

- **Node.js** – ambiente de execução
- **Express.js** – framework web para rotas e middlewares
- **JavaScript** – linguagem principal
- **Docker (opcional)** – containerização da aplicação
- **Docker Compose (opcional)** – facilitar o uso com Docker



