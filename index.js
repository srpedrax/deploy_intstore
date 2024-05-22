const express = require('express');
const path = require('path');
const { JsonDatabase } = require('wio.db');
const app = express();
const port = 8765;

const db = new JsonDatabase({ databasePath: './databases/myDatabase.json' });

app.use(express.json());
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.post('/api/admin/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  if (db.has(`admin_${username}`)) {
    return res.status(409).json({ message: 'Usuário já existe' });
  }

  db.set(`admin_${username}`, { username, password });
  res.status(201).json({ message: 'Admin registrado com sucesso' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  const adminData = db.get(`admin_${username}`);

  if (adminData && adminData.password === password) {
    res.status(200).json({ message: 'Login bem-sucedido' });
  } else {
    res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }
});

app.get('/api/products', (req, res) => {
  const products = db.get('products') || [];
  res.status(200).json(products);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});