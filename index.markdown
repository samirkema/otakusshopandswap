---
layout: default
title: Accueil Collection NFT & Art
---

<div class="homepage-container">
    <header class="main-header">
        <h1>Bienvenue sur OTAKU SHOP</h1>
        <p class="intro-claim">L'art physique débloqué par la blockchain.
        <br>Utilisez vos NFTs comme clés d'accès.</p>
    </header>

    <section id="homepage-actions">
        
        <div class="action-box box-tableau">
            <a href="{{ '/galerie.html' | relative_url }}">
                <h2>GALERIE DE TABLEAUX</h2>
                <p>Découvrez la collection complète et visualisez nos pièces.</p>
            </a>
        </div>

    <!-- MANGA -->
    <div class="action-box box-manga" id="box-manga">
        <a href="{{ '/manga.html' | relative_url }}" id="link-manga">
            <h2>LIRE LE MANGA</h2>
            <p>Accès illimité. <strong>20€ / an</strong> ou gratuit avec NFT.</p>
        </a>
        <div class="lock-banner" id="lock-manga" style="display:none">
            <span>🔒 Réservé aux abonnés</span>
            <a href="{{ '/compte.html' | relative_url }}">S'abonner →</a>
        </div>
    </div>

    <!-- COMMANDE PERSO -->
    <div class="action-box box-perso" id="box-perso">
        <a href="{{ '/commande-perso.html' | relative_url }}" id="link-perso">
            <h2>COMMANDE PERSONNALISÉE</h2>
            <p>Offre exclusive strictement réservée aux détenteurs de NFT.</p>
        </a>
        <div class="lock-banner" id="lock-perso" style="display:none">
            <span>🔒 NFT requis</span>
            <a href="{{ '/compte.html' | relative_url }}">Lier mon wallet →</a>
        </div>
    </div>

    <!-- AIDE -->
    <div class="action-box box-aide">
        <a href="{{ '/aide.html' | relative_url }}">
            <h2>BESOIN D'AIDE ?</h2>
            <p>Regardez le tutoriel vidéo pour comprendre le fonctionnement du site ou collaborer avec nous.</p>
        </a>
    </div>

    <!-- JEUX -->
    <div class="action-box box-jeux" id="box-jeux">
        <a href="{{ '/jeux.html' | relative_url }}" id="link-jeux">
            <h2>IMMERSION</h2>
            <p>L'histoire continue manette en main. Explorez l'univers de nos mangas à travers des jeux exclusifs.</p>
        </a>
        <div class="lock-banner" id="lock-jeux" style="display:none">
            <span>🔒 Réservé aux abonnés</span>
            <a href="{{ '/compte.html' | relative_url }}">S'abonner →</a>
        </div>
    </div>

    <!-- COMPTE -->
    <div class="action-box box-compte">
        <a href="{{ '/compte.html' | relative_url }}">
            <h2 id="compte-title">MON COMPTE</h2>
            <p id="compte-desc">Gérez votre profil, votre abonnement et votre wallet.</p>
        </a>
    </div>

    </section>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const level = AuthGuard.getAccessLevel();
    const user  = AuthGuard.getUser();

    // Boxes verrouillées pour utilisateur free
    if (level === 'free') {
        ['manga', 'jeux'].forEach(id => {
            const link = document.getElementById('link-' + id);
            const lock = document.getElementById('lock-' + id);
            const box  = document.getElementById('box-' + id);
            if (link) link.style.pointerEvents = 'none';
            if (lock) lock.style.display = 'flex';
            if (box)  box.style.opacity = '0.5';
        });
        // Commande perso aussi verrouillée
        const lp = document.getElementById('link-perso');
        const lk = document.getElementById('lock-perso');
        const bp = document.getElementById('box-perso');
        if (lp) lp.style.pointerEvents = 'none';
        if (lk) lk.style.display = 'flex';
        if (bp) bp.style.opacity = '0.5';
    }

    // Subscriber mais pas NFT → commande perso verrouillée
    if (level === 'subscriber') {
        const lp = document.getElementById('link-perso');
        const lk = document.getElementById('lock-perso');
        const bp = document.getElementById('box-perso');
        if (lp) lp.style.pointerEvents = 'none';
        if (lk) lk.style.display = 'flex';
        if (bp) bp.style.opacity = '0.55';
    }

    // Personnaliser le box compte
    if (user) {
        const title = document.getElementById('compte-title');
        const desc  = document.getElementById('compte-desc');
        if (title) title.textContent = user.pseudo ? '👤 ' + user.pseudo.toUpperCase() : 'MON COMPTE';
        if (level === 'subscriber' || level === 'nft') {
            if (desc) desc.textContent = '⭐ Abonnement actif — gérer mon profil';
        }
    }
});
</script>

<style>
/* --- STYLE GLOBAL THÈME NÉON --- */
.homepage-container {
    background: #000;
    color: white;
    font-family: 'Segoe UI', sans-serif;
    min-height: 100vh;
    padding: 40px 20px;
    text-align: center;
}

/* --- HEADER --- */
.main-header h1 {
    font-size: 2.5rem;
    letter-spacing: 4px;
    color: #00f2ff;
    text-shadow: 0 0 15px #00f2ff;
    margin-bottom: 10px;
}

.intro-claim {
    color: #888;
    font-size: 1.1rem;
    margin-bottom: 50px;
}

/* --- GRILLE D'ACTIONS (Version d'origine respectée) --- */
#homepage-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    max-width: 1100px;
    margin: 0 auto;
}

.action-box {
    background: rgba(17, 17, 17, 0.9);
    border: 2px solid #00f2ff;
    border-radius: 20px;
    padding: 30px;
    transition: all 0.4s ease;
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.2);
}

.action-box:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 25px #00f2ff;
    background: rgba(0, 242, 255, 0.05);
}

.action-box a {
    text-decoration: none;
    color: white;
}

.action-box h2 {
    color: #00f2ff;
    font-size: 1.5rem;
    margin-bottom: 15px;
    letter-spacing: 2px;
}

.action-box p {
    font-size: 0.9rem;
    color: #bbb;
    line-height: 1.6;
}

.box-compte { border-color: #a855f7; box-shadow: 0 0 10px rgba(168,85,247,0.2); }
.box-compte:hover { box-shadow: 0 0 25px #a855f7; }
.box-compte h2 { color: #a855f7; }

.lock-banner {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0,0,0,0.4);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.8rem;
    color: #555;
}
.lock-banner a {
    color: #00f2ff;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.78rem;
}
.lock-banner a:hover { text-decoration: underline; }

/* --- ADAPTATION MOBILE --- */
@media (max-width: 768px) {
    .main-header h1 { font-size: 1.8rem; }
    #homepage-actions { grid-template-columns: 1fr; }
}
</style>
