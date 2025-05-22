// functions/api/status/[applicationId]/handler.ts

export async function onRequestGet({ params, env }: {
    params: { applicationId: string };
    env: any;
}) {
    const { applicationId } = params;

    try {
        const stmt = env.DB.prepare(
            `SELECT status FROM applications WHERE id = ?`
        );
        const result = await stmt.bind(applicationId).first();

        if (!result) {
            return new Response(JSON.stringify({
                ok: false,
                error: "Application not found"
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({
            ok: true,
            status: result.status
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({
            ok: false,
            error: message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
