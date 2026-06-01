const router = require('express').Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

const CODE_HASH = process.env.SUBSCRIPTION_CODE_HASH || 'ea3c67e270fd3691856172d67c8eff61249a467f9374a23d354821adb973270c';
const ALCHEMY_URL = process.env.ALCHEMY_URL || 'https://eth-mainnet.g.alchemy.com/v2/Fg5inTxWbWTyJVk3wqlRz';
const NFT_CONTRACT = process.env.NFT_CONTRACT || '0x08B139e2342A46226f3a67fd43c8B6A41C0C1303';
const SUBSCRIPTION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 an

async function sha256(str) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(str).digest('hex');
}

async function checkNFTOwnership(walletAddress) {
  // balanceOf(address) — sélecteur ERC-721 : 0x70a08231
  const paddedAddr = '000000000000000000000000' + walletAddress.replace('0x', '').toLowerCase();
  const res = await fetch(ALCHEMY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'eth_call',
      params: [{ to: NFT_CONTRACT, data: '0x70a08231' + paddedAddr }, 'latest']
    })
  });
  const data = await res.json();
  if (data.error) throw new Error('Erreur Alchemy : ' + data.error.message);
  const balance = parseInt(data.result, 16);
  return balance > 0;
}

// PATCH /subscription/activate
router.patch('/activate', requireAuth, async (req, res) => {
  const { method, code, wallet_address } = req.body;

  if (method === 'code') {
    if (!code) return res.status(400).json({ error: 'Code requis' });
    const hash = await sha256(code.trim());
    if (hash !== CODE_HASH) {
      return res.status(403).json({ error: 'Code invalide' });
    }
  } else if (method === 'nft') {
    if (!wallet_address || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return res.status(400).json({ error: 'Adresse wallet invalide' });
    }
    const owns = await checkNFTOwnership(wallet_address).catch(() => false);
    if (!owns) {
      return res.status(403).json({ error: 'Aucun NFT Otaku Shop détecté sur ce wallet' });
    }
    // Lier le wallet au compte si pas encore fait
    await supabase.from('users').update({ wallet_address }).eq('id', req.user.id);
  } else {
    return res.status(400).json({ error: 'Méthode invalide (code ou nft)' });
  }

  const expires_at = new Date(Date.now() + SUBSCRIPTION_DURATION_MS).toISOString();
  const { error } = await supabase.from('users')
    .update({ subscription_tier: 'subscriber', subscription_expires_at: expires_at })
    .eq('id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, subscription_tier: 'subscriber', expires_at });
});

module.exports = router;
