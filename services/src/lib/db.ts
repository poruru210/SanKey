export async function getApplicationById(env: any, id: string): Promise<{
    accountId: string;
    email: string;
    eaType: string;
    broker: string;
    referralCode?: string;
}> {
    const stmt = env.DB.prepare(
        `SELECT accountId, email, eaType, broker, referralCode FROM applications WHERE id = ?`
    );
    const result = await stmt.bind(id).first();

    if (!result) {
        throw new Error(`Application not found: ${id}`);
    }

    return {
        accountId: result.accountId,
        email: result.email,
        eaType: result.eaType,
        broker: result.broker,
        referralCode: result.referralCode
    };
}

export async function markAsIssued(env: any, id: string): Promise<void> {
    const stmt = env.DB.prepare(
        `UPDATE applications SET status = 'issued', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    await stmt.bind(id).run();
}
