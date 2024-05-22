const express = require('express');
const path = require('path');
const multer = require('multer');
const { JsonDatabase } = require('wio.db');
const app = express();
const port = 8765;

const db = new JsonDatabase({ databasePath: './databases/myDatabase.json' });

// Configuração do Multer para armazenar as imagens na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, description, observationTitle, observationDescription } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ message: 'Nome, preço e descrição são obrigatórios' });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const newProduct = { name, price, description, imagePath };

  // Adiciona área de observações, se fornecidas
  if (observationTitle || observationDescription) {
    newProduct.observations = {
      title: observationTitle || '',
      description: observationDescription || ''
    };
  }

  const products = db.get('products') || [];
  products.push(newProduct);
  db.set('products', products);

  res.status(201).json({ message: 'Produto criado com sucesso' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://18.231.123.155:${port}`);
});