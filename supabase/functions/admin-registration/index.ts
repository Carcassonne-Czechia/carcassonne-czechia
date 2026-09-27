import {
    authenticateUser,
    corsHeaders,
    createServiceClient,
    isSha256Hex,
    jsonResponse,
} from "../_shared.ts";

function invalid(message: string) {
    return jsonResponse({ error: message }, 400);
}

async function isAdmin(
    serviceClient: ReturnType<typeof createServiceClient>,
    userId: string
) {
    const { data, error } = await serviceClient
        .from("user_permissions")
        .select("user_id")
        .eq("user_id", userId)
        .eq("permission_code", "admin")
        .maybeSingle();
    return !error && Boolean(data);
}

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const { user, error: authenticationError } =
        await authenticateUser(request);
    if (!user) {
        return jsonResponse(
            { error: authenticationError ?? "Authentication is required." },
            401
        );
    }

    const serviceClient = createServiceClient();
    if (!(await isAdmin(serviceClient, user.id))) {
        return jsonResponse(
            { error: "Administrator access is required." },
            403
        );
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return invalid("Request body must be valid JSON.");
    }

    const action = body.action;
    if (action === "list") {
        const { data, error } = await serviceClient
            .from("registration_tokens")
            .select(
                "id, token_prefix, created_at, expires_at, player_id, players(bga_username), registration_token_permissions(permission_code)"
            )
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false });

        if (error) {
            return jsonResponse({ error: error.message }, 500);
        }

        return jsonResponse({
            tokens: (data ?? []).map((token) => {
                const player = Array.isArray(token.players)
                    ? token.players[0]
                    : token.players;
                return {
                    id: token.id,
                    tokenPrefix: token.token_prefix,
                    createdAt: token.created_at,
                    expiresAt: token.expires_at,
                    playerId: token.player_id,
                    bgaUsername: player?.bga_username ?? null,
                    permissionCodes: (
                        token.registration_token_permissions ?? []
                    ).map((permission) => permission.permission_code),
                };
            }),
        });
    }

    if (action === "delete") {
        if (typeof body.id !== "string") {
            return invalid("A registration token id is required.");
        }

        const { error } = await serviceClient
            .from("registration_tokens")
            .delete()
            .eq("id", body.id);
        if (error) {
            return jsonResponse({ error: error.message }, 500);
        }
        return jsonResponse({ ok: true });
    }

    if (action === "create") {
        const playerId = body.playerId;
        const tokenHash = body.tokenHash;
        const tokenPrefix = body.tokenPrefix;
        const permissionCodes = body.permissionCodes;

        if (
            typeof playerId !== "number" ||
            !Number.isInteger(playerId) ||
            !isSha256Hex(tokenHash) ||
            typeof tokenPrefix !== "string" ||
            !Array.isArray(permissionCodes) ||
            !permissionCodes.every((code) => typeof code === "string")
        ) {
            return invalid("Invalid registration token data.");
        }

        const { data, error } = await serviceClient.rpc(
            "create_registration_token",
            {
                p_token_hash: tokenHash,
                p_token_prefix: tokenPrefix,
                p_player_id: playerId,
                p_permission_codes: permissionCodes,
                p_created_by: user.id,
            }
        );
        if (error) {
            const status = error.code === "23505" ? 409 : 400;
            return jsonResponse({ error: error.message }, status);
        }

        return jsonResponse({ token: data?.[0] ?? null }, 201);
    }

    return invalid("Unknown registration action.");
});
