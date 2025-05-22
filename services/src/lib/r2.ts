// lib/r2.ts
// Cloudflare R2 アップロードおよび署名付きURL生成

export async function uploadLicenseFile({
                                            env,
                                            accountId,
                                            eaType,
                                            licenseBase64
                                        }: {
    env: { R2: R2Bucket };
    accountId: string;
    eaType: string;
    licenseBase64: string;
}): Promise<string> {
    const objectKey = `licenses/${accountId}/${eaType}.lic`;

    await env.R2.put(objectKey, licenseBase64, {
        httpMetadata: { contentType: "text/plain" }
    });

    return objectKey;
}

export function getSignedUrl({
                                 env,
                                 key,
                                 expiresIn = 3600
                             }: {
    env: { R2: R2Bucket };
    key: string;
    expiresIn?: number;
}): string {
    // Cloudflare Workers では直接署名付きURLを発行するAPIは無いが、
    // R2 Publicバケット + Presigned URL機能で代替可能（今回は簡易想定）

    // 通常は signed URL をAPI Gateway経由で返す方式
    // ここでは仮の静的URL形式を使う（適宜修正）

    return `https://<your-r2-domain>.r2.dev/${key}`;
}
