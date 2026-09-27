import {
    createClient,
    type SupabaseClient,
} from "npm:@supabase/supabase-js@2.117.2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(
    body: Record<string, unknown>,
    status = 200
): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

export function createServiceClient(): SupabaseClient {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey =
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
        Deno.env.get("SUPABASE_SECRET_KEY");

    if (!url || !serviceKey) {
        throw new Error("Supabase service configuration is missing.");
    }

    return createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

export async function authenticateUser(request: Request) {
    const url = Deno.env.get("SUPABASE_URL");
    const publishableKey =
        Deno.env.get("SUPABASE_ANON_KEY") ??
        Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const authorization = request.headers.get("Authorization");

    if (!url || !publishableKey || !authorization) {
        return { user: null, error: "Authentication is required." };
    }

    const client = createClient(url, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: authorization } },
    });
    const { data, error } = await client.auth.getUser();

    return {
        user: data.user ?? null,
        error: error?.message ?? null,
    };
}

export async function sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value)
    );
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function isSha256Hex(value: unknown): value is string {
    return typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
}
