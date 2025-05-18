import { encryptLicense } from '../../src/services/encryption';
import { webcrypto } from 'crypto';

describe('encryptLicense', () => {
  it('should return a base64 string containing IV, ciphertext, and tag', async () => {
    const keyData = Buffer.alloc(32, 1);
    const key = await webcrypto.subtle.importKey('raw', keyData, 'AES-GCM', false, ['encrypt']);
    const payload = JSON.stringify({ eaName: 'TestEA', accountId: '1234', expiry: '2025-12-31T23:59:59Z' });
    const result = await encryptLicense(key, payload, '1234');
    expect(typeof result).toBe('string');
    const buf = Buffer.from(result, 'base64');
    expect(buf.length).toBeGreaterThan(12 + 16);
  });
});
