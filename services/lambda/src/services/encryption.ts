import { webcrypto } from 'crypto';

export async function encryptLicense(
  key: CryptoKey,
  payload: string,
  accountId: string
): Promise<string> {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const algo: AesGcmParams = {
    name: 'AES-GCM',
    iv,
    additionalData: new TextEncoder().encode(accountId),
    tagLength: 128
  };
  const ctBuffer = await webcrypto.subtle.encrypt(algo, key, new TextEncoder().encode(payload));
  const combined = new Uint8Array(iv.byteLength + ctBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ctBuffer), iv.byteLength);
  return Buffer.from(combined).toString('base64');
}
