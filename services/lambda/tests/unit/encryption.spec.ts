import { encryptLicense } from '../../src/services/encryption';
import { webcrypto } from 'crypto';

describe('encryptLicense', () => {
  it('should return a base64 string containing IV, HMAC, ciphertext, and accountId', async () => {
    const keyData = Buffer.alloc(32, 1);
    const key = await webcrypto.subtle.importKey('raw', keyData, 'AES-CBC', true, ['encrypt']);  // extractable を true に変更
    const payload = JSON.stringify({ eaName: 'TestEA', expiry: '2025-12-31T23:59:59Z' });
    const accountId = '1234';
    const result = await encryptLicense(key, payload, accountId);
    expect(typeof result).toBe('string');
    const buf = Buffer.from(result, 'base64');
    expect(buf.length).toBeGreaterThan(16 + 32);  // IV + HMAC + Ciphertext の長さをチェック
  });
});
