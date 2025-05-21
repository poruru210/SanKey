import { webcrypto } from 'crypto';

export async function encryptLicense(
    key: CryptoKey,
    payload: string,
    accountId: string
): Promise<string> {
  // --- 鍵長の検証 ---
  const rawKey = await webcrypto.subtle.exportKey("raw", key);
  if (rawKey.byteLength !== 32) {
    throw new Error("Invalid key length. Only 256-bit keys are supported.");
  }

  // --- AES-CBC 用の IV を 16 バイト生成 ---
  const iv = webcrypto.getRandomValues(new Uint8Array(16));

  // --- AES-CBC 暗号化処理 ---
  const algo: AesCbcParams = {
    name: 'AES-CBC',
    iv,
  };

  const ctBuffer = await webcrypto.subtle.encrypt(algo, key, new TextEncoder().encode(payload));

  // --- HMAC 用のキー生成 ---
  const hmacKey = await webcrypto.subtle.importKey(
      'raw',
      rawKey,  // AESキーをそのまま HMAC 用のキーに流用
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
  );

  // --- HMAC の生成 (AES-CBC 暗号文 + IV + accountId) ---
  const hmac = await webcrypto.subtle.sign(
      'HMAC',
      hmacKey,
      Buffer.concat([iv, new Uint8Array(ctBuffer), new TextEncoder().encode(accountId)])
  );

  // --- IV + HMAC + Ciphertext を結合 ---
  const combined = Buffer.concat([
    iv,
    new Uint8Array(hmac),
    new Uint8Array(ctBuffer)
  ]);

  // --- Base64 エンコードして返却 ---
  return combined.toString('base64');
}
