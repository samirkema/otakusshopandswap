const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const supabase = require('../supabase');

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://samirkema.github.io/otakusshopandswap';
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis' });

  // On répond toujours OK (sécurité : ne pas révéler si l'email existe)
  res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });

  const { data: user } = await supabase
    .from('users')
    .select('id, pseudo')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (!user) return; // email inconnu → on ne fait rien (réponse déjà envoyée)

  // Supprimer les anciens tokens pour cet utilisateur
  await supabase.from('password_resets').delete().eq('user_id', user.id);

  // Générer un token sécurisé
  const token = crypto.randomBytes(32).toString('hex');
  const token_hash = hashToken(token);
  const expires_at = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  await supabase.from('password_resets').insert({ user_id: user.id, token_hash, expires_at });

  const resetLink = `${FRONTEND_URL}/reset-password.html?token=${token}`;

  await resend.emails.send({
    from: 'Otaku Shop <noreply@otakushop.fr>',
    to: email,
    subject: '🔑 Réinitialisation de votre mot de passe',
    html: `
      <div style="background:#000;color:#fff;font-family:Segoe UI,sans-serif;padding:40px 20px;max-width:500px;margin:0 auto">
        <h1 style="color:#00f2ff;font-size:1.5rem;letter-spacing:2px;margin-bottom:8px">OTAKU SHOP</h1>
        <div style="width:60px;height:2px;background:#00f2ff;margin-bottom:28px"></div>
        <p style="color:#ccc;margin-bottom:8px">Bonjour <strong>${user.pseudo}</strong>,</p>
        <p style="color:#888;line-height:1.6;margin-bottom:28px">
          Vous avez demandé la réinitialisation de votre mot de passe.<br>
          Ce lien est valable <strong style="color:#fff">1 heure</strong>.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;background:linear-gradient(135deg,#00f2ff,#a855f7);color:#000;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:800;font-size:1rem;letter-spacing:0.5px">
          Réinitialiser mon mot de passe →
        </a>
        <p style="color:#444;font-size:0.78rem;margin-top:28px;line-height:1.5">
          Si vous n'avez pas fait cette demande, ignorez cet email.<br>
          Lien valide jusqu'au ${new Date(expires_at).toLocaleString('fr-FR')}.
        </p>
      </div>`,
  });
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token et mot de passe requis' });
  if (password.length < 6) return res.status(400).json({ error: 'Mot de passe trop court (6 min)' });

  const token_hash = hashToken(token);

  const { data: reset } = await supabase
    .from('password_resets')
    .select('id, user_id, expires_at, used')
    .eq('token_hash', token_hash)
    .maybeSingle();

  if (!reset) return res.status(400).json({ error: 'Lien invalide ou déjà utilisé' });
  if (reset.used) return res.status(400).json({ error: 'Ce lien a déjà été utilisé' });
  if (new Date(reset.expires_at) < new Date()) return res.status(400).json({ error: 'Lien expiré — demandez-en un nouveau' });

  const password_hash = await bcrypt.hash(password, 10);

  await Promise.all([
    supabase.from('users').update({ password_hash }).eq('id', reset.user_id),
    supabase.from('password_resets').update({ used: true }).eq('id', reset.id),
  ]);

  res.json({ success: true });
});

module.exports = router;
