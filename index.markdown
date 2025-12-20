---
layout: default
title: Accueil Collection NFT & Art
---

<div class="homepage-container">
    <header class="main-header">
        <h1>Bienvenue sur le site otakusshopandswap</h1>
        <p class="intro-claim">L'art physique débloqué par la blockchain. Utilisez vos NFTs comme clés d'accès.</p>
    </header>

    <section id="homepage-actions">
        
        <div class="action-box box-tableau">
            <a href="{{ '/galerie.html' | relative_url }}">
                <div class="neon-inner">
                    <h2>GALERIE DE TABLEAUX</h2>
                    <p>Découvrez la collection complète et les spécifications</p>
                </div>
            </a>
        </div>

        <div class="action-box box-manga">
            <a href="#" onclick="checkNFT('manga'); return false;">
                <div class="neon-inner">
                    <h2>LIRE</h2>
                    <p>Accès exclusif aux chapitres numériques</p>
                </div>
            </a>
        </div>

        <div class="action-box box-perso">
            <a href="{{ '/commande-perso.html' | relative_url }}">
                <div class="neon-inner">
                    <h2>COMMANDE PERSONNALISÉE</h2>
                    <p>Offre exclusive pour les gros collectionneurs ou sur devis</p>
                </div>
            </a>
        </div>

        <div class="action-box box-aide">
            <a href="{{ '/aide.html' | relative_url }}">
                <div class="neon-inner">
                    <h2>BESOIN D'AIDE ?</h2>
                    <p>Regardez la vidéo pour maitriser le site ou collaborer avec nous</p>
                </div>
            </a>
        </div>

    </section>
</div>

<style>
/* STYLE GLOBAL ACCUEIL */
.homepage-container {
    background: #000;
    color: white;
    min-height: 100vh;
    padding: 40px 20px;
    text-align: center;
    font-family: 'Segoe UI', sans-serif;
}

.main-header h1 {
    font-size: 2.5rem;
    letter-spacing: 3px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.intro-claim {
    color: #aaa;
    margin-bottom: 50px;
    font-size: 1.1rem;
}

/* GRILLE DES ACTIONS */
#homepage-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

/* STYLE COMMUN DES CASES NÉON */
.action-box {
    background: #000;
    border-radius: 15px;
    transition: all 0.4s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

.action-box a {
    text-decoration: none;
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* COULEUR NÉON BLEU (Pour toutes les cases, incluant l'Aide) */
.action-box {
    border: 3px solid #00f2ff;
    box-shadow: 0 0 15px #00f2ff, inset 0 0 10px #00f2ff;
}

.action-box:hover {
    box-shadow: 0 0 30px #00f2ff, inset 0 0 20px #00f2ff;
    transform: translateY(-5px);
    background: rgba(0, 242, 255, 0.05);
}

.action-box h2 {
    color: #00f2ff;
    text-shadow: 0 0 5px #fff, 0 0 10px #00f2ff, 0 0 2
