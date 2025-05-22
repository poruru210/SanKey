import { describe, it, expect, vi } from 'vitest';
import { uploadLicenseFile } from '../../src/lib/r2';

describe('uploadLicenseFile', () => {
    it('uploads with correct key format and calls R2.put', async () => {
        const mockPut = vi.fn();
        const env = {
            R2: {
                put: mockPut,
                head: vi.fn(),
                get: vi.fn(),
                createMultipartUpload: vi.fn(),
                resumeMultipartUpload: vi.fn(),
                delete: vi.fn(),
                list: vi.fn()
            }
        } as unknown as { R2: R2Bucket };

        const result = await uploadLicenseFile({
            env,
            accountId: "12345678",
            eaType: "basic",
            licenseBase64: "encoded-license"
        });

        expect(result).toMatch(/^licenses\/12345678\/basic\.lic$/);
        expect(mockPut).toHaveBeenCalledWith(result, "encoded-license", expect.anything());
    });
});
