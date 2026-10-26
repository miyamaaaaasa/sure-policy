// Standard Web Crypto Ed25519. Local signing only; no network or storage.
export async function signProof(text, challenge) {
  if (!/^sure-account-delete:v1:[0-9a-f]{32}:[0-9a-f]{64}$/.test(challenge)) throw Error('確認用データの形式が違います。運営から届いた全文を貼り付けてください。');
  if (text.length > 4096) throw Error('確認ファイルが違います。');
  const p = JSON.parse(text);
  if (p.format !== 'sure-deletion-proof-v1' || !/^[0-9a-f]{32}$/.test(p.user_id)
      || p.jwk?.kty !== 'OKP' || p.jwk?.crv !== 'Ed25519'
      || !/^[A-Za-z0-9_-]{43}$/.test(p.jwk?.d || '')
      || !/^[A-Za-z0-9_-]{43}$/.test(p.jwk?.x || '')) throw Error('sure.の削除専用確認ファイルを選んでください。');
  const key = await crypto.subtle.importKey('jwk', {
    kty:'OKP', crv:'Ed25519', x:p.jwk.x, d:p.jwk.d, ext:false, key_ops:['sign']
  }, {name:'Ed25519'}, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('Ed25519', key, new TextEncoder().encode(challenge)));
  return {request_id: challenge.split(':')[2], signature:btoa(String.fromCharCode(...signature))};
}

