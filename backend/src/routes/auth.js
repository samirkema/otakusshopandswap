const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, pseudo: user.pseudo },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, pseudo, password } = req.body;
  if (!email || !pseudo || !password) {
    return res.status(400).json({ error: 'Email, pseudo et mot de passe requis' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe trop court (6 caractères min)' });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},pseudo.ilike.${pseudo}`)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'Email ou pseudo déjà utilisé' });
  }

  const hash = await bcrypt.hash(password, 10);
  const { data: user, error } = await supabase
    .from('users')
    .insert({ email: email.toLowerCase(), pseudo, password_hash: hash })
    .select('id, email, pseudo, subscription_tier, wallet_address, avatar_url')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ token: signToken(user), user });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, pseudo, password_hash, subscription_tier, wallet_address, avatar_url')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const { password_hash, ...safeUser } = user;
  res.json({ token: signToken(safeUser), user: safeUser });
});

module.exports = router;
