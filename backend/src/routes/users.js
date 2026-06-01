const router = require('express').Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /users/me
router.get('/me', requireAuth, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, pseudo, subscription_tier, subscription_expires_at, wallet_address, avatar_url, created_at')
    .eq('id', req.user.id)
    .single();

  if (error || !user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ user });
});

// PATCH /users/me/wallet
router.patch('/me/wallet', requireAuth, async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
    return res.status(400).json({ error: 'Adresse wallet invalide' });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', wallet_address)
    .neq('id', req.user.id)
    .maybeSingle();

  if (existing) return res.status(409).json({ error: 'Wallet déjà lié à un autre compte' });

  const { error } = await supabase
    .from('users')
    .update({ wallet_address })
    .eq('id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PATCH /users/me/pseudo
router.patch('/me/pseudo', requireAuth, async (req, res) => {
  const { pseudo } = req.body;
  if (!pseudo || pseudo.length < 2) return res.status(400).json({ error: 'Pseudo invalide' });

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .ilike('pseudo', pseudo)
    .neq('id', req.user.id)
    .maybeSingle();

  if (existing) return res.status(409).json({ error: 'Pseudo déjà pris' });

  const { error } = await supabase
    .from('users')
    .update({ pseudo })
    .eq('id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, pseudo });
});

module.exports = router;
