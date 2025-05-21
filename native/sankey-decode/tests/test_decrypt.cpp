#include <gtest/gtest.h>
#include "SankeyDecoder.h"

TEST(DecryptLicenseTest, FailsOnInvalidBase64) {
    const char* masterKeyB64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    const char* badLicenseB64 = "!!!!invalid-b64!!!!";
    const char* accountId = "123456";

    unsigned char output[256] = {};
    int outLen = sizeof(output);

    int result = DecryptLicense(masterKeyB64, badLicenseB64, accountId, output, &outLen);
    EXPECT_EQ(result, -2);  // Base64 decode failure
}

TEST(DecryptLicenseTest, FailsOnTooShortData) {
    const char* masterKeyB64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    const char* tooShortB64 = "AAAA";  // Decodes to less than 48 bytes
    const char* accountId = "123456";

    unsigned char output[256] = {};
    int outLen = sizeof(output);

    int result = DecryptLicense(masterKeyB64, tooShortB64, accountId, output, &outLen);
    EXPECT_EQ(result, -3);  // Decoded but too short
}

TEST(DecryptLicenseTest, FailsOnInvalidKeyLength) {
    const char* shortKeyB64 = "QUJD";  // base64 of 3 bytes
    const char* licenseB64 = "AAAA";  // dummy
    const char* accountId = "123456";

    unsigned char output[256] = {};
    int outLen = sizeof(output);

    int result = DecryptLicense(shortKeyB64, licenseB64, accountId, output, &outLen);
    EXPECT_EQ(result, -12);  // Invalid key length after decode
}

TEST(DecryptLicenseTest, SuccessCaseFromApp) {
    const char* masterKeyB64 = "9H6DEu8Z0Mipgz1djyM4eUeBqZ9AqzenZHmhh7UBWTw=";
    const char* licenseB64 =
        "ht4AoFy8o2UWNSBqCIcnLaAQqq6iAWjHrB3xZU+UA571yv/soPmyCTLSDClOQSsOiDcn1mFk1CpspKT5pErhT6v7ua8aHIwLghnzcEC2qfo/gdX9HvX/RHZ7eLOEOH2TU6iSf22LpX9N9B9+7pTm6+oLJV0U5VVfGwT4Q3MVZCs=";
    const char* accountId = "1234";

    unsigned char outPayload[4096] = {};
    int outLen = sizeof(outPayload);

    int result = DecryptLicense(
        masterKeyB64,
        licenseB64,
        accountId,
        outPayload,
        &outLen
    );

    ASSERT_EQ(result, 0);
    std::string payloadStr(reinterpret_cast<char*>(outPayload), outLen);
    std::cout << "Payload: " << payloadStr << std::endl;

    EXPECT_NE(payloadStr.find("\"eaName\":\"MyEA\""), std::string::npos);
    EXPECT_NE(payloadStr.find("\"accountId\":\"1234\""), std::string::npos);
    EXPECT_NE(payloadStr.find("\"expiry\":\"2025-12-31T23:59:59Z\""), std::string::npos);
}
