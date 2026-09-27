import {
    corsHeaders,
    createServiceClient,
    jsonResponse,
    sha256Hex,
} from "../_shared.ts";

const genericRegistrationError = "Unable to complete registration.";

function registrationError(): Response {
    return jsonResponse({ error: genericRegistrationError }, 400);
}

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
        return registrationError();
    }

    try {
        const serviceClient = createServiceClient();
        const tokenHash = await sha256Hex(token);
        const { data: tokenIsValid, error: validationError } =
            await serviceClient.rpc("validate_registration_token", {
                p_token_hash: tokenHash,
            });

        if (validationError || tokenIsValid !== true) {
            return registrationError();
        }

        const { data: created, error: createError } =
            await serviceClient.auth.admin.createUser({
                email: email.trim(),
                password,
                email_confirm: true,
            });

        if (createError || !created.user) {
            return registrationError();
        }

        const { data: completed, error: completionError } =
            await serviceClient.rpc("complete_registration", {
                p_token_hash: tokenHash,
                p_user_id: created.user.id,
            });

        if (completionError || !completed?.[0]) {
            const { error: cleanupError } =
                await serviceClient.auth.admin.deleteUser(created.user.id);
            if (cleanupError) {
                console.error("Registration cleanup failed.", cleanupError);
            }
            return registrationError();
        }

        return jsonResponse({ ok: true });
    } catch (error) {
        console.error("Registration request failed.", error);
        return registrationError();
    }
});
