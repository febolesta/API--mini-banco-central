const { Client } = require('pg');

const client = new Client({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432,
});

client.connect();

module.exports = client;
