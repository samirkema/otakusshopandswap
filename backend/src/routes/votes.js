const router = require('express').Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /votes/my?photo_id=xxx  — savoir si l'user a voté sur une photo
router.get('/my', requireAuth, async (req, res) => {
  const { photo_id } = req.query;
  if (!photo_id) return res.status(400).json({ error: 'photo_id requis' });

  const { data } = await supabase
    .from('votes')
    .select('remix_id')
    .eq('voter_user_id', req.user.id)
    .eq('photo_id', photo_id)
    .maybeSingle();

  res.json({ voted_remix_id: data?.remix_id || null });
});

// POST /votes  — voter pour un remix
router.post('/', requireAuth, async (req, res) => {
  const { remix_id } = req.body;
  if (!remix_id) return res.status(400).json({ error: 'remix_id requis' });

  // Récupérer le remix cible
  const { data: remix } = await supabase
    .from('remixes')
    .select('id, user_id, photo_id, votes_count')
    .eq('id', remix_id)
    .single();

  if (!remix) return res.status(404).json({ error: 'Remix introuvable' });

  // Pas de vote pour soi-même
  if (remix.user_id === req.user.id) {
    return res.status(403).json({ error: 'Vous ne pouvez pas voter pour votre propre remix' });
  }

  // 1 vote par photo par utilisateur
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_user_id', req.user.id)
    .eq('photo_id', remix.photo_id)
    .maybeSingle();

  if (existingVote) {
    return res.status(409).json({ error: 'Vous avez déjà voté pour cette photo' });
  }

  // Insérer le vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert({ voter_user_id: req.user.id, remix_id, photo_id: remix.photo_id });

  if (voteError) return res.status(500).json({ error: voteError.message });

  // Incrémenter votes_count
  await supabase
    .from('remixes')
    .update({ votes_count: remix.votes_count + 1 })
    .eq('id', remix_id);

  res.status(201).json({ success: true, votes_count: remix.votes_count + 1 });
});

module.exports = router;
