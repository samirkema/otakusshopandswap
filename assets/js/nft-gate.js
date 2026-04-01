// --- CONFIGURATION ---
const ALCHEMY_API_URL = "https://eth-mainnet.g.alchemy.com/v2/Fg5inTxWbWTyJVk3wqlRz"; 
const CONTRACT_ADDRESS = "0x08B139e2342A46226f3a67fd43c8B6A41C0C1303"; 

// --- GESTION ABONNEMENT BITCOIN ---
function hasPaidAccess() {
    const expiry = localStorage.getItem('manga_access_expiry');
    if (!expiry) return false;
    return new Date().getTime() < parseInt(expiry);
}

// Appelez cette fonction sur votre page de succès après paiement Coinbase
function activateMangaAccess() {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date().getTime() + thirtyDays;
    localStorage.setItem('manga_access_expiry', expiryDate);
    alert("Accès Premium activé pour 30 jours !");
}

/**
 * Fonction de vérification hybride (NFT ou Bitcoin)
 */
async function checkNFT(targetId) {
    // 1. Vérification PRIORITAIRE de l'abonnement Bitcoin pour le Manga
    if (targetId === 'manga' && hasPaidAccess()) {
        window.location.href = '/otakusshopandswap/manga.html';
        return;
    }

    // 2. Vérification Web3 classique
    if (typeof window.ethereum === 'undefined') {
        if (targetId === 'manga') {
            alert("Veuillez vous abonner en Bitcoin ou installer un portefeuille Web3.");
        } else {
            alert("Veuillez installer MetaMask pour réclamer votre tableau.");
        }
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); 
        const signer = await provider.getSigner(); 
        const userAddress = await signer.getAddress();

        const apiUrl = `${ALCHEMY_API_URL}/getNFTsForOwner?owner=${userAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=false`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const nftCount = data.ownedNfts ? data.ownedNfts.length : 0;

        if (nftCount > 0) {
            if (targetId === 'manga') {
                window.location.href = '/otakusshopandswap/manga.html';
            } else if (targetId.startsWith('details-')) {
                const tableauId = targetId.split('-')[1]; 
                // Récupération du format actuel depuis la galerie si disponible
                const format = typeof currentFormat !== 'undefined' ? currentFormat : 'grand';
                window.location.href = `/otakusshopandswap/details-tableau.html?id=${tableauId}&size=${format}`;
            }
        } else {
            alert("Accès refusé. Détenteurs de NFT ou abonnés Bitcoin uniquement.");
        }
    } catch (error) {
        console.error("Erreur Web3:", error);
    }
}