#include <SankeyDecoder.mqh>

int OnInit()
{
   string masterKey = "9H6DEu8Z0Mipgz1djyM4eUeBqZ9AqzenZHmhh7UBWTw=";
   string accountId = IntegerToString(AccountNumber()); 
   string licenseB64 = "";
   //string licenseB64 = "ht4AoFy8o2UWNSBqCIcnLaAQqq6iAWjHrB3xZU+UA571yv/soPmyCTLSDClOQSsOiDcn1mFk1CpspKT5pErhT6v7ua8aHIwLghnzcEC2qfo/gdX9HvX/RHZ7eLOEOH2TU6iSf22LpX9N9B9+7pTm6+oLJV0U5VVfGwT4Q3MVZCs=";
   //string accountId = "1234"; 
   
   // MQL4/Files/license.txt
   int handle = FileOpen("license.txt", FILE_READ | FILE_TXT | FILE_ANSI);
   if (handle < 0)
   {
      Comment("ライセンスファイルの読み込みに失敗しました");
      return INIT_FAILED;
   }
   licenseB64 = FileReadString(handle);
   FileClose(handle);


   // DLLに渡すためのuchar配列を用意
   uchar masterKeyBuf[128];
   uchar licenseBuf[1024];
   uchar accountIdBuf[32];

   StringToCharArray(masterKey, masterKeyBuf);
   StringToCharArray(licenseB64, licenseBuf);
   StringToCharArray(accountId, accountIdBuf);

   uchar outPayload[4096];
   int outLen = ArraySize(outPayload);

   int result = DecryptLicense(
      masterKeyBuf,
      licenseBuf,
      accountIdBuf,
      outPayload,
      outLen
   );

   if (result == 0)
   {
      string decoded = CharArrayToString(outPayload, 0, outLen);
      Comment("復号成功\n", decoded);
   }
   else
   {
      Comment("復号失敗（コード: ", result, "）");
   }

   return INIT_SUCCEEDED;
}
