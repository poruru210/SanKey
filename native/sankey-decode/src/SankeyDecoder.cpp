#include "SankeyDecoder.h"
#include <windows.h>
#include <wincrypt.h>
#include <string>
#include <vector>

// ユーティリティ: Base64デコード
bool base64_decode(const std::string& in, std::vector<unsigned char>& out) {
    DWORD len = 0;
    if (!CryptStringToBinaryA(in.c_str(), 0, CRYPT_STRING_BASE64, NULL, &len, NULL, NULL))
        return false;
    out.resize(len);
    return CryptStringToBinaryA(in.c_str(), 0, CRYPT_STRING_BASE64, out.data(), &len, NULL, NULL) != 0;
}

// ユーティリティ: HMAC-SHA256
bool hmac_sha256(const std::vector<unsigned char>& key, const std::vector<unsigned char>& data, std::vector<unsigned char>& mac) {
    HCRYPTPROV hProv = 0;
    HCRYPTHASH hHash = 0;
    HCRYPTKEY hKey = 0;

    struct {
        BLOBHEADER hdr;
        DWORD keyLen;
    } blobHeader = {
        {PLAINTEXTKEYBLOB, CUR_BLOB_VERSION, 0, CALG_RC2}, // type, ver, reserved, ALG
        (DWORD)key.size()
    };

    std::vector<unsigned char> blob(sizeof(blobHeader) + key.size());
    memcpy(blob.data(), &blobHeader, sizeof(blobHeader));
    memcpy(blob.data() + sizeof(blobHeader), key.data(), key.size());

    mac.resize(32);

    if (!CryptAcquireContext(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT)) return false;
    bool ok = false;
    if (CryptImportKey(hProv, blob.data(), blob.size(), 0, CRYPT_IPSEC_HMAC_KEY, &hKey)) {
        if (CryptCreateHash(hProv, CALG_HMAC, hKey, 0, &hHash)) {
            HMAC_INFO hmacInfo;
            ZeroMemory(&hmacInfo, sizeof(hmacInfo));
            hmacInfo.HashAlgid = CALG_SHA_256;
            CryptSetHashParam(hHash, HP_HMAC_INFO, (BYTE*)&hmacInfo, 0);
            CryptHashData(hHash, data.data(), data.size(), 0);
            DWORD macLen = 32;
            if (CryptGetHashParam(hHash, HP_HASHVAL, mac.data(), &macLen, 0)) ok = true;
            CryptDestroyHash(hHash);
        }
        CryptDestroyKey(hKey);
    }
    CryptReleaseContext(hProv, 0);
    return ok;
}

// ユーティリティ: AES-CBC復号
bool aes_cbc_decrypt(const std::vector<unsigned char>& key, const std::vector<unsigned char>& iv,
                     const std::vector<unsigned char>& cipher, std::vector<unsigned char>& plain) {
    HCRYPTPROV hProv = 0;
    HCRYPTKEY hKey = 0;

    struct {
        BLOBHEADER hdr;
        DWORD keyLen;
    } blobHeader = {
        {PLAINTEXTKEYBLOB, CUR_BLOB_VERSION, 0, CALG_AES_256},
        (DWORD)key.size()
    };
    std::vector<unsigned char> blob(sizeof(blobHeader) + key.size());
    memcpy(blob.data(), &blobHeader, sizeof(blobHeader));
    memcpy(blob.data() + sizeof(blobHeader), key.data(), key.size());

    bool ok = false;
    if (!CryptAcquireContext(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT)) return false;
    if (CryptImportKey(hProv, blob.data(), blob.size(), 0, 0, &hKey)) {
        // IV設定
        CryptSetKeyParam(hKey, KP_IV, iv.data(), 0);
        plain = cipher;
        DWORD plen = (DWORD)plain.size();
        if (CryptDecrypt(hKey, 0, TRUE, 0, plain.data(), &plen)) {
            plain.resize(plen);
            ok = true;
        }
        CryptDestroyKey(hKey);
    }
    CryptReleaseContext(hProv, 0);
    return ok;
}

extern "C" __declspec(dllexport)
int DecryptLicense(const char* masterKeyB64, const char* licenseB64, const char* accountId, unsigned char* outPayload, int* outPayloadLen) {
    if (!masterKeyB64 || !licenseB64 || !accountId || !outPayload || !outPayloadLen) return -1;

    std::vector<unsigned char> masterKey;
    if (!base64_decode(masterKeyB64, masterKey)) return -11;
    if (masterKey.size() != 32) return -12;

    std::vector<unsigned char> licenseBin;
    if (!base64_decode(licenseB64, licenseBin)) return -2;
    if (licenseBin.size() < 48) return -3;

    std::vector<unsigned char> iv(licenseBin.begin(), licenseBin.begin() + 16);
    std::vector<unsigned char> hmac(licenseBin.begin() + 16, licenseBin.begin() + 48);
    std::vector<unsigned char> cipher(licenseBin.begin() + 48, licenseBin.end());

    std::vector<unsigned char> hmacInput;
    hmacInput.insert(hmacInput.end(), iv.begin(), iv.end());
    hmacInput.insert(hmacInput.end(), cipher.begin(), cipher.end());
    hmacInput.insert(hmacInput.end(), (unsigned char*)accountId, (unsigned char*)accountId + strlen(accountId));
    std::vector<unsigned char> mac;
    if (!hmac_sha256(masterKey, hmacInput, mac)) return -4;
    if (memcmp(mac.data(), hmac.data(), 32) != 0) return -5;

    std::vector<unsigned char> plain;
    if (!aes_cbc_decrypt(masterKey, iv, cipher, plain)) return -6;

    if ((int)plain.size() > *outPayloadLen) return -7;
    memcpy(outPayload, plain.data(), plain.size());
    *outPayloadLen = (int)plain.size();

    return 0;
}