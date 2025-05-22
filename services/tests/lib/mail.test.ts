import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendLicenseEmail } from '../../src/lib/mail';

describe('sendLicenseEmail', () => {
    const to = "test@example.com";
    const licenseUrl = "https://example.com/license.txt";
    const eaUrl = "https://example.com/ea.ex4";

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({ ok: true, status: 200, json: async () => ({}) })
        ));
    });

    it('calls fetch with correct payload', async () => {
        const env = { RESEND_API_KEY : "dummy" };

        await sendLicenseEmail({ to, licenseUrl, eaUrl, env });

        expect(fetch).toHaveBeenCalledTimes(1);
        const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const call = mockFetch.mock.calls[0];

        expect(call[0]).toBe("https://api.resend.com/emails");
        const body = JSON.parse(call[1].body);

        expect(body.to).toBe(to);
        expect(body.subject).toBe("【SANKY】ライセンスとEAダウンロードリンク");
        expect(body.html).toContain(licenseUrl);
        expect(body.html).toContain(eaUrl);
    });
});
