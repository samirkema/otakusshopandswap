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
                <h2>LIRE </h2>
                <p>Accès exclusif aux chapitres numériques</p>
            </a>
        </div>

        <div class="action-box box-perso">
            <a href="{{ '/commande-perso.html' | relative_url }}">
                <h2>COMMANDE PERSONNALISÉE</h2>
                <p>Offre exclusive pour les gros collectionneurs ou sur devis</p>
            </a>
        </div>
    </section>
</div>
