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
                <h2>GALERIE DE TABLEAUX</h2>
                <p>Découvrez la collection complète et les spécifications</p>
            </a>
        </div>

        <div class="action-box box-manga">
            <a href="#" onclick="checkNFT('manga'); return false;">
                <h2>LIRE</h2>
                <p>Accès exclusif aux chapitres numériques</p>
            </a>
        </div>

        <div class="action-box box-perso">
            <a href="{{ '/commande-perso.html' | relative_url }}">
                <h2>COMMANDE PERSONNALISÉE</h2>
                <p>Offre exclusive pour les gros collectionneurs ou sur devis</p>
            </a>
        </div>

        <div class="action-box box-aide">
            <a href="{{ '/aide.html' | relative_url }}">
                <h2>BESOIN D'AIDE ?</h2>
                <p>Regardez notre vidéo pour apprendre à utiliser le site ou collaborer avec nous. </p>
            </a>
        </div>
    </section>
</div>

<style>
/* ... gardez vos styles box-tableau, box-manga, box-perso ... */

/* CASE AIDE : STYLE ROSE NÉON VIF */
.box-aide {
    background: rgba(255, 0, 255, 0.05) !important; /* Fond très légèrement teinté */
    border: 3px solid #ff00ff !important; /* Bordure rose néon épaisse */
    box-shadow: 0 0 15px #ff00ff, inset 0 0 10px rgba(255, 0, 255, 0.2) !important;
    transition: all 0.3s ease;
}

.box-aide:hover {
    background: rgba(255, 0, 255, 0.2) !important;
    box-shadow: 0 0 30px #ff00ff !important;
    transform: translateY(-5px);
}

/* Couleur du texte interne */
.box-aide h2 {
    color: #ff00ff !important;
    text-shadow: 0 0 10px #ff00ff;
    font-weight: bold;
}

.box-aide p {
    color: #ffffff !important; /* Texte blanc pur pour la lisibilité sur fond noir */
    opacity: 0.9;
}
</style>
