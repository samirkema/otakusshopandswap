const ALCHEMY_API_URL = "https://eth-mainnet.g.alchemy.com/v2/Fg5inTxWbWTyJVk3wqlRz";
const CONTRACT_ADDRESS = "0x08B139e2342A46226f3a67fd43c8B6A41C0C1303";

// Hash SHA-256 du code d'activation (jamais le code en clair).
// Pour générer le hash de votre code secret, ouvrez la console sur n'importe quelle
// page du site et tapez : sha256('VOTRE_CODE').then(console.log)
// Puis collez la valeur ici.
const CODE_HASH = "ea3c67e270fd3691856172d67c8eff61249a467f9374a23d354821adb973270c";

// --- SYSTÈME DE MODALES ---
(function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nft-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center}
        .nft-modal{background:#111;border:2px solid #00f2ff;border-radius:15px;padding:30px;max-width:420px;width:90%;text-align:center;box-shadow:0 0 30px rgba(0,242,255,.3);color:#fff;font-family:'Segoe UI',sans-serif}
        .nft-modal p{margin:0 0 20px;line-height:1.6;color:#ccc}
        .nft-modal-btn{background:#00f2ff;color:#000;border:none;padding:10px 25px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:1rem;transition:.2s}
        .nft-modal-btn:hover{box-shadow:0 0 15px #00f2ff}
        .nft-modal-btn.secondary{background:transparent;color:#888;border:1px solid #444}
        .nft-modal-btn.secondary:hover{color:#fff;border-color:#fff;box-shadow:none}
        .nft-modal-row{display:flex;gap:10px;justify-content:center;margin-top:5px}
        .nft-modal-input{width:100%;padding:10px;margin:10px 0 20px;background:#222;border:1px solid #444;border-radius:8px;color:#fff;font-size:1rem;box-sizing:border-box}
        .nft-modal-input:focus{outline:none;border-color:#00f2ff}
    `;
    document.head.appendChild(style);
})();

function showModal(message) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'nft-overlay';
        overlay.innerHTML = `<div class="nft-modal"><p>${message}</p><button class="nft-modal-btn">OK</button></div>`;
        overlay.querySelector('.nft-modal-btn').onclick = () => { overlay.remove(); resolve(); };
        document.body.appendChild(overlay);
    });
}

function showPromptModal(message) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'nft-overlay';
        overlay.innerHTML = `
            <div class="nft-modal">
                <p>${message}</p>
                <input class="nft-modal-input" type="text" placeholder="Votre code...">
                <div class="nft-modal-row">
                    <button class="nft-modal-btn secondary" id="modal-cancel">Annuler</button>
                    <button class="nft-modal-btn" id="modal-ok">Valider</button>
                </div>
            </div>`;
        const input = overlay.querySelector('.nft-modal-input');
        const close = (val) => { overlay.remove(); resolve(val); };
        overlay.querySelector('#modal-ok').onclick = () => close(input.value);
        overlay.querySelector('#modal-cancel').onclick = () => close(null);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') close(input.value); });
        document.body.appendChild(overlay);
        input.focus();
    });
}

// --- UTILITAIRES ---
async function sha256(message) {
    const data = new TextEncoder().encode(message);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isValidEthAddress(addr) {
    return typeof addr === 'string' && /^0x[0-9a-fA-F]{40}$/.test(addr);
}

// --- GESTION ACCÈS ---
function hasPaidAccess() {
    const expiry = localStorage.getItem('manga_access_expiry');
    return expiry && new Date().getTime() < parseInt(expiry);
}

async function checkNFT(targetId) {
    if (targetId === 'manga' && hasPaidAccess()) {
        window.location.href = 'manga.html';
        return;
    }

    if (typeof window.ethereum === 'undefined') {
        await showModal(targetId === 'manga'
            ? "Vous n'êtes pas abonné. Connectez un portefeuille Web3 ou activez un code d'accès."
            : "Portefeuille Web3 non détecté. Installez MetaMask pour continuer.");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const userAddress = accounts[0];

        const apiUrl = `${ALCHEMY_API_URL}/getNFTsForOwner?owner=${userAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=false`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.ownedNfts && data.ownedNfts.length > 0) {
            // On stocke l'adresse Ethereum vérifiée (pas un simple booléen)
            sessionStorage.setItem('nft_verified', userAddress);

            if (targetId === 'manga') {
                window.location.href = 'manga.html';
            } else if (targetId === 'perso') {
                window.location.href = 'commande-perso.html';
            } else {
                const tableauId = targetId.split('-')[1];
                const format = typeof currentFormat !== 'undefined' ? currentFormat : 'grand';
                window.location.href = `details-tableau.html?id=${tableauId}&size=${format}`;
            }
        } else {
            await showModal(targetId === 'perso'
                ? "Accès refusé. La commande personnalisée est réservée aux détenteurs de NFT."
                : "Accès refusé. NFT requis ou abonnement de 20€ pour le manga.");
        }
    } catch (e) {
        console.error(e);
        await showModal("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
    }
}

// --- PAIEMENTS ---
function payWithBitcoin() {
    const links = {
        'grand': 'https://nowpayments.io/payment/?iid=4989301026',
        'petit': 'https://nowpayments.io/payment/?iid=4370265558'
    };
    window.open(links[currentFormat] || links['grand'], '_blank');
}

function subscribeManga() {
    window.open("https://nowpayments.io/payment/?iid=5919905608", '_blank');
}

async function activateWithCode() {
    const code = await showPromptModal("Entrez le code d'activation reçu après votre paiement :");
    if (!code) return;

    const hash = await sha256(code.trim());

    if (hash === CODE_HASH) {
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        localStorage.setItem('manga_access_expiry', new Date().getTime() + oneYear);
        await showModal("Félicitations ! Votre abonnement annuel est activé.");
        window.location.href = "manga.html";
    } else {
        await showModal("Code incorrect. Vérifiez votre reçu NowPayments ou contactez le support.");
    }
}

function activateYearlyAccess() {
    localStorage.setItem('manga_access_expiry', new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    showModal("Abonnement annuel activé !").then(() => { window.location.href = 'manga.html'; });
}
