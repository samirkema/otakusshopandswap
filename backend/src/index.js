require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:4000',
    'http://localhost:4321',
    'http://127.0.0.1:4321',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use('/auth',    require('./routes/auth'));
app.use('/users',   require('./routes/users'));
app.use('/remixes', require('./routes/remixes'));
app.use('/votes',   require('./routes/votes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API Otaku Shop sur :${PORT}`));
