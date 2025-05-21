#pragma once

#ifdef __cplusplus
extern "C" {
#endif

// 戻り値: 0=成功, それ以外はエラー
__declspec(dllexport)
int DecryptLicense(
    const char* masterKeyB64,       // Base64 encoded 文字列
    const char* licenseB64,         // null-terminated
    const char* accountId,          // null-terminated
    unsigned char* outPayload,      // 出力バッファ
    int* outPayloadLen              // [in]最大長, [out] 実際の長さ
);

#ifdef __cplusplus
}
#endif
