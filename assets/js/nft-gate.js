const ALCHEMY_API_URL = "https://eth-mainnet.g.alchemy.com/v2/Fg5inTxWbWTyJVk3wqlRz"; 
const CONTRACT_ADDRESS = "0x08B139e2342A46226f3a67fd43c8B6A41C0C1303"; 

// --- GESTION ACCÈS ---
function hasPaidAccess() {
    const expiry = localStorage.getItem('manga_access_expiry');
    return expiry && new Date().getTime() < parseInt(expiry);
}

async function checkNFT(targetId) {
    // 1. Priorité Abonnement pour le Manga
    if (targetId === 'manga' && hasPaidAccess()) {
        window.location.href = 'manga.html';
        return;
    }

    // 2. Vérification Web3
    if (typeof window.ethereum === 'undefined') {
        alert(targetId === 'manga' ? "Abonnez-vous (20€/an) ou utilisez un Wallet Web3." : "Vous n'êtes pas abonné");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); 
        const userAddress = accounts[0];

        const apiUrl = `${ALCHEMY_API_URL}/getNFTsForOwner?owner=${userAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=false`;
        const response = await fetch(apiUrl);
        // ... après l'appel fetch à Alchemy ...
        const data = await response.json();

        if (data.ownedNfts && data.ownedNfts.length > 0) {
            // Le NFT est trouvé !
            sessionStorage.setItem('nft_verified', 'true');
            
            // On choisit la bonne porte de sortie selon le bouton cliqué
            if (targetId === 'manga') {
                window.location.href = 'manga.html';
            } else if (targetId === 'perso') {
                window.location.href = 'commande-perso.html'; // Redirection vers commande perso
            } else {
                // Pour la galerie de tableaux
                const tableauId = targetId.split('-')[1];
                const format = typeof currentFormat !== 'undefined' ? currentFormat : 'grand';
                window.location.href = `details-tableau.html?id=${tableauId}&size=${format}`;
            }
        } else {
            // Si pas de NFT
            if (targetId === 'perso') {
                alert("Accès refusé. La commande personnalisée est réservée aux détenteurs de NFT.");
            } else {
                alert("Accès refusé. NFT requis ou abonnement de 20€ pour le manga.");
            }
        }
    } catch (e) { console.error(e); }
}

// --- PAIEMENTS ---
function payWithBitcoin() {
    const links = {
        'grand': 'https://nowpayments.io/payment/?iid=TON_ID_50', 
        'petit': 'https://nowpayments.io/payment/?iid=TON_ID_25'
    };
    window.open(links[currentFormat] || links['grand'], '_blank');
}

function subscribeManga() {
    // Ton ID NowPayments pour l'abonnement à 20€
    const nowPaymentsUrl = "https://nowpayments.io/payment/?iid=5919905608";
    window.open(nowPaymentsUrl, '_blank');

    // On propose d'activer l'accès immédiatement après le paiement
    setTimeout(() => {
        if (confirm("Une fois votre paiement de 20€ effectué, cliquez sur OK pour activer votre accès annuel.")) {
            activateYearlyAccess(); 
        }
    }, 3000); 
}

function activateYearlyAccess() {
    const expiryDate = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
    localStorage.setItem('manga_access_expiry', expiryDate);
    alert("Abonnement annuel activé !");
    window.location.href = 'manga.html';
}