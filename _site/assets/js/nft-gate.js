// ====================================================================
// NFT GATING LOGIC (ERC-1155 UNIVERSAL ACCESS via ALCHEMY API)
// ====================================================================

// --- CONFIGURATION CRITIQUE ---
// !!! REMPLACEZ CETTE VALEUR PAR VOTRE CLÉ API ALCHEMY !!!
const ALCHEMY_API_URL = "https://eth-mainnet.g.alchemy.com/v2/Fg5inTxWbWTyJVk3wqlRz"; 
// Adresse du contrat NFT (Swap-Swap)
const CONTRACT_ADDRESS = "0x08B139e2342A46226f3a67fd43c8B6A41C0C1303"; 

/**
 * Fonction principale appelée par les boutons (Galerie et Manga).
 * @param {string} targetId - Ex: 'manga' ou 'details-001'.
 */
async function checkNFT(targetId) {
    if (typeof window.ethereum === 'undefined') {
        alert("Veuillez installer un portefeuille Web3 (Coinbase Wallet, MetaMask, etc.) pour vous connecter.");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // 1. FORCER LA DEMANDE DE CONNEXION (Méthode Ethers v6)
        const accounts = await provider.send("eth_requestAccounts", []); 

        if (accounts.length === 0) {
             alert("Connexion échouée : Le portefeuille n'a pas autorisé l'accès.");
             return;
        }

        const signer = await provider.getSigner(); 
        const userAddress = await signer.getAddress();

        // 2. Vérification du réseau (Ethereum Mainnet = Chain ID 1)
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== 1) { 
            alert("Veuillez connecter votre portefeuille au réseau Ethereum Principal (Mainnet).");
            return;
        }

        // 3. Appel à l'API ALCHEMY pour vérifier l'inventaire total
        const apiUrl = `${ALCHEMY_API_URL}/getNFTsForOwner?owner=${userAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=false`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const nftCount = data.ownedNfts ? data.ownedNfts.length : 0;

        // 4. Logique de Gating : Si le compte possède au moins 1 NFT de la collection
        if (nftCount > 0) {
            console.log(`Accès accordé. ${nftCount} NFT(s) trouvé(s) pour la collection.`);
            
            // Redirection vers la destination (manga ou détails)
            if (targetId === 'manga') {
                window.location.href = '/manga.html';
            } else if (targetId.startsWith('details-')) {
                const tableauId = targetId.split('-')[1]; 
                window.location.href = `/details-tableau.html?id=${tableauId}`;
            }
        } else {
            alert(`Accès refusé. Vous devez posséder au moins 1 NFT de la collection SWAP-SWAP pour accéder à ce contenu.`);
        }

    } catch (error) {
        console.error("Erreur de vérification API/Web3 :", error);
        alert("Une erreur de vérification est survenue. Vérifiez si votre clé API Alchemy est correcte.");
    }
}

// --- Initialisation des Événements (Écouteur sur les boutons) ---

document.addEventListener('DOMContentLoaded', () => {
    // Écouteur sur tous les boutons de la galerie
    const gatedButtons = document.querySelectorAll('.gallery-gate-btn');

    gatedButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            const targetId = button.getAttribute('data-target');
            
            if (targetId) {
                checkNFT(targetId);
            }
        });
    });
});