// lib/mail.ts
// Resend APIを使ったライセンス配布通知メール送信処理

export async function sendLicenseEmail({
                                           to,
                                           licenseUrl,
                                           eaUrl,
                                           env
                                       }: {
    to: string;
    licenseUrl: string;
    eaUrl: string;
    env: { RESEND_API_KEY: string };
}) {
    const body = {
        from: "noreply@niraikanai.trade",
        to,
        subject: "【SANKY】ライセンスとEAダウンロードリンク",
        html: `
      <p>ご利用ありがとうございます。</p>
      <p>以下よりEAとライセンスファイルをダウンロードしてください：</p>
      <ul>
        <li><strong>EA:</strong> <a href="${eaUrl}">${eaUrl}</a></li>
        <li><strong>License:</strong> <a href="${licenseUrl}">${licenseUrl}</a></li>
      </ul>
      <p>※このメールは自動送信されています。</p>
    `
    };

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resend failed: ${res.status} - ${text}`);
    }
}
