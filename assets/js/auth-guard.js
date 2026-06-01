/**
 * OTAKU SHOP — Auth Guard
 * Niveaux d'accès :
 *   'free'       → galerie + aide + compte uniquement
 *   'subscriber' → + manga + jeux (abonnement payé ou NFT)
 *   'nft'        → + commandes personnalisées (NFT vérifié)
 */

const AuthGuard = (() => {
  function getUser() {
    try { return JSON.parse(localStorage.getItem('myremix_user')); } catch { return null; }
  }

  function getAccessLevel() {
    const user = getUser();

    // Un compte connecté avec abonnement valide est requis
    if (user && user.subscription_tier === 'subscriber') {
      const exp = user.subscription_expires_at;
      if (!exp || new Date(exp) > new Date()) {
        return user.wallet_address ? 'nft' : 'subscriber';
      }
    }

    return 'free';
  }

  // true si le niveau actuel >= niveau requis
  function hasAccess(required) {
    const order = { free: 0, subscriber: 1, nft: 2 };
    return order[getAccessLevel()] >= order[required];
  }

  /**
   * À appeler en haut de chaque page protégée.
   * @param {string} required - 'subscriber' ou 'nft'
   * @param {string} reason   - message affiché dans la modale
   */
  function requireAccess(required, reason) {
    if (hasAccess(required)) return;

    // Modale bloquante
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,sans-serif';
    overlay.innerHTML = `
      <div style="background:#111;border:2px solid #00f2ff;border-radius:16px;padding:36px 28px;max-width:420px;width:90%;text-align:center;box-shadow:0 0 30px rgba(0,242,255,.25)">
        <div style="font-size:2.5rem;margin-bottom:16px">🔒</div>
        <h2 style="color:#00f2ff;font-size:1.3rem;letter-spacing:2px;margin-bottom:12px">ACCÈS RESTREINT</h2>
        <p style="color:#888;font-size:.9rem;line-height:1.6;margin-bottom:24px">${reason}</p>
        <a href="/compte.html" style="display:block;background:linear-gradient(135deg,#00f2ff,#a855f7);color:#000;text-decoration:none;padding:13px;border-radius:8px;font-weight:800;font-size:.95rem;margin-bottom:10px">
          Gérer mon abonnement →
        </a>
        <a href="/" style="color:#555;font-size:.82rem;text-decoration:none">← Retour à l'accueil</a>
      </div>`;
    document.body.appendChild(overlay);

    // Bloquer le contenu derrière
    document.querySelectorAll('body > *:not(:last-child)').forEach(el => {
      if (el !== overlay) el.style.filter = 'blur(4px)';
    });
  }

  return { getAccessLevel, hasAccess, getUser, requireAccess };
})();
