# OTAKU SHOP — Plateforme Manga & Art NFT

> Plateforme dédiée aux passionnés de manga, webtoon et dessin.  
> Mode classique + mode blockchain. Galerie, lecture, jeux communautaires et commandes personnalisées.

🌐 **Site live** : [samirkema.github.io/otakusshopandswap](https://samirkema.github.io/otakusshopandswap)  
🔧 **API** : [otakusshop.onrender.com](https://otakusshop.onrender.com)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Jekyll (GitHub Pages) + HTML/CSS/JS vanilla |
| Backend | Node.js + Express (Render) |
| Base de données | Supabase (PostgreSQL) |
| Auth | JWT maison (bcryptjs) |
| Email | Resend |
| Crypto / NFT | Ethers.js v6 + Alchemy API |
| Paiement | NowPayments (Bitcoin) |

---

## Structure du projet

```
otakusshopandswap/
│
├── _layouts/
│   └── default.html          # Layout Jekyll global (scripts, theme toggle)
│
├── assets/
│   ├── css/style.css
│   ├── images/
│   │   ├── icones/           # Icônes des boxes homepage + jeux
│   │   └── remix/            # Photos du jeu My Remix
│   └── js/
│       ├── auth-guard.js     # Contrôle d'accès universel (free/subscriber/nft)
│       ├── nft-gate.js       # Vérification NFT + modales (ancien système)
│       ├── theme.js          # Toggle dark/light mode
│       └── libs/ethers-6.15.0.min.js
│
├── backend/                  # API Express — déployée sur Render
│   ├── src/
│   │   ├── index.js          # Point d'entrée
│   │   ├── supabase.js       # Client Supabase (service key)
│   │   ├── middleware/auth.js # Vérification JWT
│   │   └── routes/
│   │       ├── auth.js            # POST /auth/register, /auth/login
│   │       ├── forgot-password.js # POST /auth/forgot-password, /auth/reset-password
│   │       ├── users.js           # GET /users/me, PATCH wallet/pseudo
│   │       ├── remixes.js         # GET/POST/DELETE /remixes
│   │       ├── votes.js           # GET/POST /votes
│   │       └── subscription.js    # PATCH /subscription/activate
│   ├── supabase_schema.sql   # Schéma à exécuter dans Supabase SQL Editor
│   └── .env.example          # Variables d'environnement requises
│
├── index.markdown            # Page d'accueil
├── galerie.html              # Galerie de tableaux + achat Bitcoin
├── manga.html                # Lecture manga (🔒 abonné)
├── manga_en.html             # Version anglaise (🔒 abonné)
├── manga_jp.html             # Version japonaise (🔒 abonné)
├── jeux.html                 # Zone Immersion — grille de jeux (🔒 abonné)
├── my-remix.html             # Jeu My Remix — photomontage battle (🔒 abonné)
├── commande-perso.html       # Commandes personnalisées (🔒 NFT uniquement)
├── compte.html               # Gestion de compte (profil / abonnement / wallet)
├── reset-password.html       # Réinitialisation mot de passe
└── aide.html                 # Tutoriel vidéo + guide complet
```

---

## Niveaux d'accès

| Page | Gratuit | Abonné | NFT |
|------|:-------:|:------:|:---:|
| Galerie de tableaux | ✅ | ✅ | ✅ |
| Besoin d'aide | ✅ | ✅ | ✅ |
| Mon Compte | ✅ | ✅ | ✅ |
| Lire le manga | 🔒 | ✅ | ✅ |
| Zone Immersion / Jeux | 🔒 | ✅ | ✅ |
| Commandes personnalisées | 🔒 | 🔒 | ✅ |

L'accès est géré par `assets/js/auth-guard.js` chargé globalement dans le layout Jekyll.

### Activer un abonnement
Depuis `compte.html` → onglet **Abonnement** :
1. **Code d'activation** — reçu après paiement NowPayments
2. **NFT** — vérification MetaMask via Alchemy (`getNFTsForOwner`)
3. **Paiement Bitcoin** — lien NowPayments direct (20€/an)

---

## Jeu My Remix

Photomontage battle communautaire.

- Sélection d'une photo parmi celles disponibles
- Dessin sur le canvas HTML5 (souris, tactile, stylet avec pression)
- Outils : pinceau, gomme, taille, opacité, palette couleur, undo/redo
- Soumission → stockage de l'image en base64 dans Supabase
- Galerie des remixes par photo, triée par votes
- Vote : 1 vote par photo par utilisateur, impossible de voter pour soi
- Couronne 👑 pour le remix le plus voté

---

## API — Endpoints

```
GET  /health

POST /auth/register           { email, pseudo, password }
POST /auth/login              { email, password }
POST /auth/forgot-password    { email }
POST /auth/reset-password     { token, password }

GET  /users/me
PATCH /users/me/pseudo        { pseudo }
PATCH /users/me/wallet        { wallet_address }

GET  /remixes?photo_id=xxx
POST /remixes                 { photo_id, image_url }  🔒 abonné
DELETE /remixes/:id           🔒 auteur

GET  /votes/my?photo_id=xxx   🔒
POST /votes                   { remix_id }  🔒

PATCH /subscription/activate  { method: 'code'|'nft', code?, wallet_address? }  🔒
```

---

## Base de données Supabase

```sql
users           — id, email, pseudo, password_hash, wallet_address,
                  subscription_tier, subscription_expires_at, avatar_url
remixes         — id, user_id, photo_id, image_url, votes_count
votes           — id, voter_user_id, remix_id, photo_id  (unique voter+photo)
password_resets — id, user_id, token_hash, expires_at, used
```

> Le schéma complet est dans `backend/supabase_schema.sql`.  
> À exécuter dans **Supabase → SQL Editor**.

---

## Déploiement

### GitHub Pages (frontend)
Push sur `main` → déploiement automatique via GitHub Actions.

### Render (backend)
- **Root Directory** : `backend`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

**Variables d'environnement Render** :

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=votre_secret_min_32_chars
FRONTEND_URL=https://samirkema.github.io
RESEND_API_KEY=re_xxxxxxxxxxxx
```

> ⚠️ Le plan gratuit Render met le serveur en veille après inactivité.  
> La première connexion peut prendre **30 secondes à 2 minutes**.  
> Toutes les actions suivantes sont instantanées.

---

## Développement local

```bash
# Frontend (Jekyll)
bundle exec jekyll serve

# Backend
cd backend
cp .env.example .env   # remplir les variables
npm install
npm run dev            # node --watch src/index.js
```

---

## NFT Collection

- **Collection** : SWAP-SWAP sur OpenSea
- **Contrat** : `0x08B139e2342A46226f3a67fd43c8B6A41C0C1303` (Ethereum mainnet)
- **Vérification** : Alchemy `getNFTsForOwner` REST API

---

## Contact

📧 [kilimangarocontact@gmail.com](mailto:kilimangarocontact@gmail.com)  
🌊 [Collection NFT sur OpenSea](https://opensea.io/collection/swap-swap-54096494)
