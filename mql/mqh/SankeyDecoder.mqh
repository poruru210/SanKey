//+------------------------------------------------------------------+
//|                                                SankeyDecoder.mqh |
//|                                           Copyright 2025, poruru |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, poruru"
#property link      "https://www.mql5.com"
#property strict

//+------------------------------------------------------------------+
//| DLL imports                                                      |
//+------------------------------------------------------------------+
#import "SankeyDecoder.dll"
int DecryptLicense(
   const uchar &masterKeyB64[],
   const uchar &licenseB64[],
   const uchar &accountId[],
   uchar       &outPayload[],
   int         &outPayloadLen
);
#import
