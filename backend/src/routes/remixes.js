const router = require('express').Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /remixes?photo_id=xxx  — liste des remixes d'une photo
router.get('/', async (req, res) => {
  const { photo_id } = req.query;
  if (!photo_id) return res.status(400).json({ error: 'photo_id requis' });

  const { data, error } = await supabase
    .from('remixes')
    .select('id, photo_id, image_url, votes_count, created_at, users(pseudo, avatar_url)')
    .eq('photo_id', photo_id)
    .order('votes_count', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ remixes: data });
});

// POST /remixes  — soumettre un remix (abonné requis)
router.post('/', requireAuth, async (req, res) => {
  const { photo_id, image_url } = req.body;
  if (!photo_id || !image_url) {
    return res.status(400).json({ error: 'photo_id et image_url requis' });
  }

  // Vérifier abonnement
  const { data: user } = await supabase
    .from('users')
    .select('subscription_tier, subscription_expires_at')
    .eq('id', req.user.id)
    .single();

  const isSubscribed =
    user.subscription_tier === 'subscriber' &&
    (!user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date());

  if (!isSubscribed) {
    return res.status(403).json({ error: 'Abonnement requis pour soumettre un remix', code: 'SUBSCRIPTION_REQUIRED' });
  }

  // Un seul remix par user par photo
  const { data: existing } = await supabase
    .from('remixes')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('photo_id', photo_id)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'Vous avez déjà soumis un remix pour cette photo', remix_id: existing.id });
  }

  const { data: remix, error } = await supabase
    .from('remixes')
    .insert({ user_id: req.user.id, photo_id, image_url, votes_count: 0 })
    .select('id, photo_id, image_url, votes_count, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ remix });
});

// DELETE /remixes/:id  — supprimer son remix
router.delete('/:id', requireAuth, async (req, res) => {
  const { data: remix } = await supabase
    .from('remixes')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!remix) return res.status(404).json({ error: 'Remix introuvable' });
  if (remix.user_id !== req.user.id) return res.status(403).json({ error: 'Non autorisé' });

  await supabase.from('remixes').delete().eq('id', req.params.id);
  res.json({ success: true });
});

module.exports = router;
