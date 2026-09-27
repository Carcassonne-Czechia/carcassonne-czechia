import {
    corsHeaders,
    createServiceClient,
    jsonResponse,
    sha256Hex,
} from "../_shared.ts";

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405);
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const token = body.token;
    const email = body.email;
    const password = body.password;
    if (
        typeof token !== "string" ||
        token.length < 32 ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.includes("@") ||
        password.length < 6
    ) {
        return jsonResponse(
            { error: "A valid token, email, and password are required." },
            400
        );
    }

    const serviceClient = createServiceClient();
    const { data: created, error: createError } =
        await serviceClient.auth.admin.createUser({
            email: email.trim(),
            password,
            email_confirm: true,
        });

    if (createError || !created.user) {
        return jsonResponse(
            { error: createError?.message ?? "Unable to create the account." },
            400
        );
    }

    const tokenHash = await sha256Hex(token);
    const { data: completed, error: completionError } = await serviceClient.rpc(
        "complete_registration",
        {
            p_token_hash: tokenHash,
            p_user_id: created.user.id,
        }
    );

    if (completionError || !completed?.[0]) {
        await serviceClient.auth.admin.deleteUser(created.user.id);
        return jsonResponse(
            {
                error:
                    completionError?.message ??
                    "The registration token is invalid or expired.",
            },
            400
        );
    }

    return jsonResponse({ ok: true });
});
