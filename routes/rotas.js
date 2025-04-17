
const express = require("express");
const router = express.Router();
const bancoController = require("../controllers/bancoController");


router.post("/instituicoes", bancoController.criarInstituicao);

router.post("/usuarios/:id/contas", bancoController.criarConta);

router.post("/usuarios/:id/transacoes", bancoController.adicionarTransacao);

router.get("/usuarios/:id/saldo", bancoController.verSaldo);

router.get("/usuarios/:id/extrato", bancoController.verExtrato);

module.exports = router;
