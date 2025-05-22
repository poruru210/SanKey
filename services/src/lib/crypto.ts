// AES-CBC + HMAC-SHA256 ライセンス生成（Base64エンコード形式）

export async function generateLicense({
                                          payload,
                                          accountId,
                                          aesKey,
                                          hmacKey
                                      }: {
    payload: Record<string, any>;
    accountId: string;
    aesKey: Uint8Array;   // 32バイト AES鍵（AES-256）
    hmacKey: Uint8Array;  // 32バイト HMAC鍵
}): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const plaintext = encoder.encode(JSON.stringify(payload));

    // AES暗号化
    const aesCryptoKey = await crypto.subtle.importKey(
        "raw",
        aesKey,
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );

    const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        aesCryptoKey,
        plaintext
    );
    const ciphertext = new Uint8Array(ciphertextBuffer);

    // HMAC対象: IV + ciphertext + accountId
    const accountIdBytes = encoder.encode(accountId);
    const hmacInput = new Uint8Array(iv.length + ciphertext.length + accountIdBytes.length);
    hmacInput.set(iv, 0);
    hmacInput.set(ciphertext, iv.length);
    hmacInput.set(accountIdBytes, iv.length + ciphertext.length);

    const hmacKeyObj = await crypto.subtle.importKey(
        "raw",
        hmacKey,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const hmacBuffer = await crypto.subtle.sign("HMAC", hmacKeyObj, hmacInput);
    const hmac = new Uint8Array(hmacBuffer);

    // ライセンス形式: IV (16B) + HMAC (32B) + ciphertext
    const licenseBuffer = new Uint8Array(iv.length + hmac.length + ciphertext.length);
    licenseBuffer.set(iv, 0);
    licenseBuffer.set(hmac, iv.length);
    licenseBuffer.set(ciphertext, iv.length + hmac.length);

    return btoa(String.fromCharCode(...licenseBuffer));
}

export async function verifyLicense({
                                        licenseBase64,
                                        accountId,
                                        aesKey,
                                        hmacKey
                                    }: {
    licenseBase64: string;
    accountId: string;
    aesKey: Uint8Array;
    hmacKey: Uint8Array;
}): Promise<any> {
    const data = Uint8Array.from(atob(licenseBase64), c => c.charCodeAt(0));
    const iv = data.slice(0, 16);
    const hmac = data.slice(16, 48);
    const ciphertext = data.slice(48);

    const cryptoKey = await crypto.subtle.importKey("raw", hmacKey, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify(
        "HMAC",
        cryptoKey,
        hmac,
        concatUint8Arrays(iv, ciphertext, new TextEncoder().encode(accountId))
    );
    if (!valid) throw new Error("HMAC verification failed");

    const aesCryptoKey = await crypto.subtle.importKey("raw", aesKey, { name: "AES-CBC" }, false, ["decrypt"]);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, aesCryptoKey, ciphertext);
    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
