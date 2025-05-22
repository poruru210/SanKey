// functions/api/approve/handler.ts
import { generateLicense } from "../../../lib/crypto";
import { uploadLicenseFile, getSignedUrl } from "../../../lib/r2";
import { sendLicenseEmail } from "../../../lib/mail";
import { getApplicationById, markAsIssued } from "../../../lib/db";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
    const { applicationId } = await request.json() as {
        applicationId: string;
        eaType: string; // 旧方式の互換用だが今回はD1から取得
    };

    // D1から申請情報を取得
    const application = await getApplicationById(env, applicationId);
    const { accountId, email, eaType } = application;

    // payloadにユーザー情報（拡張可）
    const payload = {
        name: "Example User",
        email,
        expiryDate: "2025-12-31",
        features: ["basic"]
    };

    const aesKeyB64 = env.LICENSE_ENCRYPTION_KEY;
    const aesKey = Uint8Array.from(atob(aesKeyB64), c => c.charCodeAt(0));

    const licenseB64 = await generateLicense({
        payload,
        accountId,
        aesKey,
        hmacKey: aesKey
    });

    const objectKey = await uploadLicenseFile({
        env,
        accountId,
        eaType,
        licenseBase64: licenseB64
    });

    const licenseUrl = getSignedUrl({ env, key: objectKey });
    const eaUrl = getSignedUrl({ env, key: `eas/${eaType}.ex4` });

    await sendLicenseEmail({
        to: email,
        licenseUrl,
        eaUrl,
        env
    });

    await markAsIssued(env, applicationId);

    return new Response(JSON.stringify({
        ok: true,
        message: "License issued and email sent.",
        licenseUrl,
        eaUrl
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
