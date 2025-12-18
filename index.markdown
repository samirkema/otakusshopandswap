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
                <p>Découvrez la collection complète.</p>
            </a>
        </div>

        <div class="action-box box-manga">
            <a href="#" onclick="checkNFT('manga'); return false;">
                <h2>LIRE LE MANGA</h2>
                <p>Accès exclusif aux chapitres numériques réservé aux détenteurs de NFT.</p>
            </a>
        </div>

        <div class="action-box box-perso">
            <a href="{{ '/commande-perso.html' | relative_url }}">
                <h2>COMMANDE PERSONNALISÉE</h2>
                <p>Offre exclusive pour les collectionneurs ou commandes sur devis.</p>
            </a>
        </div>
    </section>
</div>

<style>
/* --- STYLE GLOBAL THÈME NÉON --- */
.homepage-container {
    background: #000; 
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    padding: 60px 20px;
    text-align: center;
}

/* --- HEADER --- */
.main-header h1 {
    font-size: 2.8rem;
    letter-spacing: 5px;
    color: #00f2ff; 
    text-shadow: 0 0 20px #00f2ff;
    margin-bottom: 20px;
    text-transform: uppercase;
}

.intro-claim {
    color: #888;
    font-size: 1.2rem;
    margin-bottom: 60px;
    line-height: 1.6;
}

/* --- GRILLE D'ACTIONS --- */
#homepage-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.action-box {
    background: #111;
    border: 2px solid #00f2ff; 
    border-radius: 20px;
    padding: 40px 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 15px rgba(0, 242, 255, 0.1);
}

.action-box:hover {
    transform: translateY(-15px);
    box-shadow: 0 0 30px #00f2ff; 
    background: rgba(0, 242, 255, 0.05);
}

.action-box a {
    text-decoration: none;
    color: white;
}

.action-box h2 {
    color: #00f2ff;
    font-size: 1.6rem;
    margin-bottom: 20px;
    letter-spacing: 2px;
}

.action-box p {
    font-size: 1rem;
    color: #aaa;
    line-height: 1.5;
}

/* --- ADAPTATION MOBILE --- */
@media (max-width: 768px) {
    .main-header h1 { font-size: 2rem; }
    #homepage-actions { grid-template-columns: 1fr; }
}
</style>
