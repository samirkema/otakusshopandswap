---
layout: default
title: Accueil Collection NFT & Art
---

<div class="homepage-container">
    <header class="main-header">
        <h1>Bienvenue sur OTAKU SHOP</h1>
        [cite_start]<p class="intro-claim">L'art physique débloqué par la blockchain. [cite: 1]
        [cite_start]<br>Utilisez vos NFTs comme clés d'accès. [cite: 2]</p>
    </header>

    <section id="homepage-actions">
        
        <div class="action-box box-tableau">
            [cite_start]<a href="{{ '/galerie.html' | relative_url }}"> [cite: 3]
                <h2>GALERIE DE TABLEAUX</h2>
                <p>Découvrez la collection complète et visualisez vos pièces.</p>
            </a>
        </div>

        <div class="action-box box-manga">
            <a href="#" onclick="checkNFT('manga'); return false;">
                <h2>LIRE LE MANGA</h2>
                <p>Accès exclusif aux chapitres numériques réservé aux détenteurs.</p>
            </a>
        </div>

        <div class="action-box box-perso">
            [cite_start]<a href="{{ '/commande-perso.html' | relative_url }}"> [cite: 4]
                <h2>COMMANDE PERSONNALISÉE</h2>
                <p>Offre exclusive pour les collectionneurs ou sur devis.</p>
            </a>
        </div>
    </section>
</div>

<style>
/* --- STYLE GLOBAL THÈME NÉON --- */
.homepage-container {
    background: #000; /* Fond noir profond comme la galerie */
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
    color: #00f2ff; /* Bleu néon */
    text-shadow: 0 0 15px #00f2ff;
    margin-bottom: 10px;
}

.intro-claim {
    color: #888;
    font-size: 1.1rem;
    margin-bottom: 50px;
}

/* --- GRILLE D'ACTIONS --- */
#homepage-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    max-width: 1100px;
    margin: 0 auto;
}

.action-box {
    background: rgba(17, 17, 17, 0.9);
    border: 2px solid #00f2ff; /* Bordure bleue néon */
    border-radius: 20px;
    padding: 30px;
    transition: all 0.4s ease;
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.2);
}

.action-box:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 25px #00f2ff; /* Effet de lueur intense au survol */
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

/* --- ADAPTATION MOBILE --- */
@media (max-width: 768px) {
    .main-header h1 { font-size: 1.8rem; }
    #homepage-actions { grid-template-columns: 1fr; }
}
</style>
