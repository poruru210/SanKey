import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onRequestPost } from '../../../src/functions/api/approve/handler';

describe('approve handler integration', () => {
    const dummyAppId = "test-application-id";

    const mockD1 = {
        prepare: vi.fn(() => ({
            bind: vi.fn(() => ({
                first: vi.fn(() => Promise.resolve({
                    id: dummyAppId,
                    accountId: "12345678",
                    eaType: "basic",
                    email: "user@example.com",
                    status: "pending"
                })),
                run: vi.fn(() => Promise.resolve())
            }))
        }))
    };

    const mockPut = vi.fn(() => Promise.resolve());
    const mockFetch = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({})
    }));

    beforeEach(() => {
        vi.stubGlobal("fetch", mockFetch);
    });

    it('approves a license application end-to-end', async () => {
        const request = new Request("http://localhost", {
            method: "POST",
            body: JSON.stringify({ applicationId: dummyAppId }),
        });

        const env = {
            DB: mockD1,
            R2: {
                put: mockPut,
                head: vi.fn(),
                get: vi.fn(() =>
                    Promise.resolve({
                        body: new ReadableStream({
                            start(controller) {
                                controller.enqueue(new TextEncoder().encode("dummy-ea-content"));
                                controller.close();
                            }
                        })
                    })
                ),
                createMultipartUpload: vi.fn(),
                resumeMultipartUpload: vi.fn(),
                delete: vi.fn(),
                list: vi.fn()
            },
            LICENSE_ENCRYPTION_KEY: "9H6DEu8Z0Mipgz1djyM4eUeBqZ9AqzenZHmhh7UBWTw=",
            RESEND_API_KEY: "dummy"
        };

        const res = await onRequestPost({ request, env });
        const json = await res.json() as {
            ok: boolean;
            licenseUrl: string;
            eaUrl: string;
        };

        expect(res.status).toBe(200);
        expect(json.ok).toBe(true);
        expect(json.licenseUrl).toMatch(/^https:\/\/.*basic\.lic/);
        expect(json.eaUrl).toMatch(/basic\.(ex4|ex5)/);

        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
