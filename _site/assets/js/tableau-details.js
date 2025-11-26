// ====================================================================
// DONNÉES DU TABLEAU (Simule une base de données externe)
// Contient les informations des 9 tableaux affichées sur la page de détails protégée.
// ====================================================================
const tableauData = {
    '001': {
        title: "Pièce #001",
        image: "/assets/images/tableau-001-HR.jpg", // Image Haute Résolution
        imageMur: "/assets/images/tableau-001-transparent.png", // Image pour la vue mur (PNG transparent)
        specs: "Dimensions: 80x80cm. Acrylique sur toile. Certificat d'authenticité inclus. Poids: 4kg.",
        description: "Photomontage de l'artiste."
    },
    '002': {
        title: "Pièce #002",
        image: "/assets/images/tableau-002-HR.jpg",
        imageMur: "/assets/images/tableau-002-transparent.png",
        specs: "Dimensions: 60x90cm. Peinture numérique. Poids: 5kg.",
        description: "Peinture numérique de l'artiste."
    },
    '003': {
        title: "Pièce #003",
        image: "/assets/images/tableau-003-HR.jpg",
        imageMur: "/assets/images/tableau-003-transparent.png",
        specs: "Dimensions: 50x50cm. Photomontage. Cadre inclus.",
        description: "Photomontage de l'artiste."
    },
    '004': {
        title: "Pièce #004",
        image: "/assets/images/tableau-004-HR.jpg",
        imageMur: "/assets/images/tableau-004-transparent.png",
        specs: "Dimensions: 100x70cm. Technique mixte. Encadré.",
        description: "Photomontage de l'artiste."
    },
    '005': {
        title: "Pièce #005",
        image: "/assets/images/tableau-005-HR.jpg",
        imageMur: "/assets/images/tableau-005-transparent.png",
        specs: "Dimensions: 70x70cm. Sérigraphie sur bois.",
        description: "Photomontage de l'artiste."
    },
    '006': {
        title: "Pièce #006",
        image: "/assets/images/tableau-006-HR.jpg",
        imageMur: "/assets/images/tableau-006-transparent.png",
        specs: "Dimensions: 40x60cm. Peinture numérique. Gravure.",
        description: "Peinture numérique de l'artiste."
    },
    '007': {
        title: "Pièce #007",
        image: "/assets/images/tableau-007-HR.jpg",
        imageMur: "/assets/images/tableau-007-transparent.png",
        specs: "Dimensions: 90x90cm. Photomontage sur alu-dibond.",
        description: "Photomontage de l'artiste."
    },
    '008': {
        title: "Pièce #008",
        image: "/assets/images/tableau-008-HR.jpg",
        imageMur: "/assets/images/tableau-008-transparent.png",
        specs: "Dimensions: 110x70cm. Photomontage et technique mixte.",
        description: "Photomontage de l'artiste."
    },
    '009': {
        title: "Pièce #009",
        image: "/assets/images/tableau-009-HR.jpg",
        imageMur: "/assets/images/tableau-009-transparent.png",
        specs: "Dimensions: 75x75cm. Photomontage.",
        description: "Photomontage de l'artiste."
    }
};

// ====================================================================
// FONCTION PRINCIPALE : CHARGEMENT DES DÉTAILS
// ====================================================================

function displayDetails() {
    // 1. Lire l'ID du tableau dans l'URL (e.g., ?id=001)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id && tableauData[id]) {
        const data = tableauData[id];

        // 2. Peupler les éléments HTML avec les données
        document.getElementById('detail-title').innerText = data.title;
        document.getElementById('detail-image').src = data.image; // Charge l'image HR par défaut
        
        document.getElementById('detail-specs').innerHTML = `
            <strong>Dimensions et Matériaux :</strong> ${data.specs}<br>
            <strong>Description :</strong> ${data.description}`;
        
        document.getElementById('detail-price-public').innerHTML = `
            <span style="color: #A0529A; font-weight: bold;">Cette œuvre est disponible GRATUITEMENT pour la réclamation via le NFT.</span>`;
        // Mettre à jour le champ caché du formulaire
        document.getElementById('form-tableau-id').value = id;

        // 3. Afficher le contenu et masquer le chargement
        document.getElementById('tableau-loading').style.display = 'none';
        document.getElementById('tableau-content').style.display = 'block';

    } else {
        document.getElementById('tableau-loading').innerText = "Erreur : Tableau introuvable ou ID manquant. Retournez à la galerie.";
    }
}

// ====================================================================
// FONCTIONNALITÉ DE VISUALISATION (Vue Mur / Vue Taille)
// ====================================================================

function changeView(viewType) {
    const mainImage = document.getElementById('detail-image');
    const imageContainer = document.getElementById('image-container');
    const currentId = document.getElementById('form-tableau-id').value;
    
    if (!currentId) return;

    // Réinitialisation des styles de conteneur
    imageContainer.style.backgroundImage = 'none';
    imageContainer.classList.remove('wall-view');
    mainImage.style.display = 'block';
    mainImage.src = tableauData[currentId].image; // Image HR par défaut

    if (viewType === 'vue-mur') {
        // Logique pour AFFICHAGE SUR MUR
        // 1. Masquer l'image standard
        mainImage.style.display = 'none';
        
        // 2. Définir le fond de mur (externe) et ajouter la classe pour les styles CSS
        imageContainer.style.backgroundImage = `url('/assets/images/wall-background.jpg')`; 
        imageContainer.classList.add('wall-view');
        
        // 3. Afficher le PNG de l'œuvre sur le mur via CSS/JS
        // NOTE: Ceci nécessite l'image tableau-00X-transparent.png
        
        alert("Affichage sur Mur activé ! (Nécessite des images et des styles CSS 'wall-view' supplémentaires.)");

    } else if (viewType === 'vue-taille') {
        // Logique pour AFFICHAGE DE TAILLE
        // On revient à l'image HR du tableau, mais on pourrait changer la source
        // pour une image avec une figure humaine pour l'échelle, si elle existe.
        alert("Affichage de Taille comparée activé !");
    }
}

// Lancement de la fonction displayDetails() lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    // Exécute displayDetails UNIQUEMENT si l'élément cible existe
    if (document.getElementById('tableau-loading')) {
        displayDetails();
    }
});