const express = require('express');
const app = express();
const port = 8765;

// Middleware para parsing de JSON
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
