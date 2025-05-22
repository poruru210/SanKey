# 🛠 SANKY License Distribution System - Cloudflare構成仕様

## ✅ 概要

SANKYは、EA（Expert Advisor）とライセンスファイルの配布をWebベースで自動化するシステムです。  
CloudflareのPages、Workers、R2、D1を活用し、低コストかつ高速にライセンスの申請、承認、通知までを完結させます。

---

## ✅ 最終全体構成図（Cloudflare完全統合）

```plaintext
🌐 Cloudflare Pages
├── /apply             ← 申請画面（ユーザー）
├── /status            ← ステータス確認（口座番号で照会）
├── /admin             ← 管理画面（Cloudflare Access 保護）

⚙️ Cloudflare Workers API
├── POST /api/apply          → 申請受付（D1登録）
├── POST /api/approve        → 承認 + ライセンス生成 + R2保存 + 通知
├── POST /api/resend         → 再通知
├── GET  /api/applications   → 管理UI用 一覧取得
├── GET  /api/eas            → EAリスト取得
├── GET  /api/status/:accountId → 申請状況取得

📦 R2（ストレージ）
├── eas/StrategyA.ex4
├── eas/StrategyB.ex5
└── licenses/{accountId}/{eaType}.lic （Base64テキスト）

🗃️ D1（データベース）
├── applications（申請情報）
├── licenses（ライセンス発行履歴）
└── eas（EAのメタデータ／種類）

📩 SendGrid
- 承認時のダウンロードリンク通知

🔐 Cloudflare Access
- `/admin` 以下を保護（メールドメイン or 指定ユーザー）

🔐 ライセンス生成方式
- AES-CBC + HMAC（Node.jsで Workers に移植済）
```

---

## 📂 ディレクトリ構成

```plaintext
sanky-license/
├── wrangler.toml
├── public/                     # Pages UI (/apply, /admin, /status)
├── functions/
│   └── api/
│       ├── apply.ts            # POST: 申請受付
│       ├── approve.ts          # POST: 承認 + ライセンス生成 + 通知
│       ├── resend.ts           # POST: 再通知
│       ├── applications.ts     # GET: 申請一覧（管理画面用）
│       ├── eas.ts              # GET: EA種類一覧
│       └── status/[accountId].ts # GET: ステータス確認
├── lib/
│   ├── crypto.ts               # AES-CBC + HMAC暗号化処理
│   ├── r2.ts                   # R2アップロードと署名URL生成
│   ├── db.ts                   # D1アクセス
│   └── mail.ts                 # SendGrid送信処理
├── templates/
│   └── licenseEmail.md         # メールテンプレート
└── .env                        # 環境変数（開発用）
```

---

## 📝 その他仕様

（中略：前回と同様のスキーマ定義、暗号化方式、申請フロー、ツール類、ステータス表など）

---

## 📌 次のステップ候補

- Wranglerプロジェクトの雛形生成
- Pages UIの申請/管理画面初期実装
- API `/apply`, `/approve`, `/resend` の実装開始
- Cloudflare R2の署名付きURLコード統合
