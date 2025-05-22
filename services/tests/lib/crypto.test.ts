import { describe, it, expect } from 'vitest';
import { generateLicense, verifyLicense } from '../../src/lib/crypto';

describe('License encryption and verification', () => {
    const payload = {
        name: "Test User",
        email: "test@example.com",
        expiryDate: "2099-12-31",
        features: ["basic"]
    };
    const accountId = "12345678";
    const key = new Uint8Array(32).fill(1); // 固定キー（テスト用）

    it('should generate and verify license correctly', async () => {
        const license = await generateLicense({
            payload,
            accountId,
            aesKey: key,
            hmacKey: key
        });

        const decoded = await verifyLicense({
            licenseBase64: license,
            accountId,
            aesKey: key,
            hmacKey: key
        });

        expect(decoded).toHaveProperty("name", "Test User");
        expect(decoded).toHaveProperty("email", "test@example.com");
        expect(decoded).toHaveProperty("expiryDate", "2099-12-31");
        expect(decoded.features).toContain("basic");
    });

    it('should fail verification with wrong accountId', async () => {
        const license = await generateLicense({
            payload,
            accountId,
            aesKey: key,
            hmacKey: key
        });

        await expect(verifyLicense({
            licenseBase64: license,
            accountId: "wrong-id",
            aesKey: key,
            hmacKey: key
        })).rejects.toThrow("HMAC verification failed");
    });
});
