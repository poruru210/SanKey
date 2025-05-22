// services/tests/functions/api/status.test.ts
import { describe, it, expect, vi } from 'vitest';
import { onRequestGet} from "../../../src/functions/api/status/[applicationId]/handler";

describe('status GET handler', () => {
    const dummyAppId = "test-application-id";

    it('returns issued status if application is found', async () => {
        const mockPrepare = vi.fn(() => ({
            bind: vi.fn(() => ({
                first: vi.fn(() => Promise.resolve({
                    id: dummyAppId,
                    status: "issued"
                }))
            }))
        }));

        const env = {
            DB: {
                prepare: mockPrepare
            }
        };

        const request = new Request(`http://localhost/api/status/${dummyAppId}`, {
            method: "GET"
        });
        const context = {
            request,
            env,
            params: { applicationId: dummyAppId }
        } as Parameters<typeof onRequestGet>[0]

        const res = await onRequestGet(context);
        const json = await res.json() as { status: string };

        expect(res.status).toBe(200);
        expect(json.status).toBe("issued");
    });

    it('returns 404 if no application found', async () => {
        const mockPrepare = vi.fn(() => ({
            bind: vi.fn(() => ({
                first: vi.fn(() => Promise.resolve(undefined))
            }))
        }));

        const env = {
            DB: {
                prepare: mockPrepare
            }
        };

        const request = new Request(`http://localhost/api/status/${dummyAppId}`, {
            method: "GET"
        });
        const context = {
            request,
            env,
            params: { applicationId: dummyAppId }
        } as Parameters<typeof onRequestGet>[0];

        const res = await onRequestGet(context);

        expect(res.status).toBe(404);
    });
});
