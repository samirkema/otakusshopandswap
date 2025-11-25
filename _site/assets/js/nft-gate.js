// ====================================================================
// NFT GATING LOGIC (ERC-1155 Collection Check)
// Vérifie si le portefeuille connecté détient le Token ID spécifique #5 de la collection.
// ====================================================================

// --- Paramètres de Votre Collection NFT (SWAP-SWAP) ---
const CONTRACT_ADDRESS = "0x08B139e2342A46226f3a67fd43c8B6A41C0C1303"; 
const REQUIRED_AMOUNT = 1; // Au moins 1 exemplaire est requis.
const KEY_TOKEN_ID = 5; // L'ID du jeton spécifique à vérifier pour l'accès.

// L'ABI pour la fonction balanceOf d'un contrat ERC-1155 (adresse et ID).
const ABI = [
    // balanceOf(adresse du compte, ID du jeton)
    "function balanceOf(address account, uint256 id) view returns (uint256)" 
];


/**
 * Déclenche la connexion au portefeuille, vérifie la possession du NFT ID #5, et redirige.
 * @param {string} targetId L'ID de la pièce à visualiser (ex: 'details-001').
 */
async function checkNFT(targetId) {
    if (typeof window.ethereum === 'undefined') {
        alert("Veuillez installer un portefeuille Web3 (Coinbase Wallet, MetaMask, etc.) pour vous connecter.");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 1. Demande la connexion au portefeuille et obtient l'adresse de l'utilisateur.
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        
        // 2. Initialisation du Contrat
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // 3. Vérification de la Balance Totale pour le Token ID #5
        // Ceci est l'étape critique qui vérifie la possession spécifique.
        const balance = await nftContract.balanceOf(userAddress, KEY_TOKEN_ID);
        const count = balance.toNumber();

        // 4. Logique de Gating et Redirection
        if (count >= REQUIRED_AMOUNT) {
            console.log(`Accès accordé. Vous possédez ${count} exemplaire(s) du NFT ID #${KEY_TOKEN_ID}.`);
            
            // Redirection vers la page de détails spécifique
            const tableauId = targetId.split('-')[1]; 
            window.location.href = `/pages/details-tableau.html?id=${tableauId}`;

        } else {
            alert(`Accès refusé. Vous devez posséder au moins ${REQUIRED_AMOUNT} exemplaire du NFT ID #${KEY_TOKEN_ID} de la collection SWAP-SWAP.`);
        }

    } catch (error) {
        console.error("Erreur de vérification Web3 :", error);
        alert("La connexion ou la vérification du NFT a échoué. Assurez-vous que votre portefeuille est sur le réseau Ethereum Mainnet.");
    }
}