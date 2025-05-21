import type React from "react"
import type {Metadata} from "next"
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css"
import {ThemeProvider} from "@/components/theme-provider"

const notoSansJP = Noto_Sans_JP({
    subsets: ["latin" ],     // 日本語＋必要なら latin
    variable: "--font-noto-sans-jp",     // 任意で CSS 変数にも登録
    display: "swap",                     // フォント表示戦略
});

export const metadata: Metadata = {
    title: "SANKEY License Generator",
    description: "Generate secure licenses with Sankey",
    generator: 'v0.dev'
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html
            lang="ja"
            className={`${notoSansJP.className} light`}
            style={{colorScheme: "light"}}
            suppressHydrationWarning
        >
        <body className="bg-white text-black">
        <ThemeProvider>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

