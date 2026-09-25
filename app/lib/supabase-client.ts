import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }

    const url = import.meta.env.VITE_SUPABASE_URL;
    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !publishableKey) {
        throw new Error(
            "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY"
        );
    }

    if (publishableKey.startsWith("sb_secret_")) {
        throw new Error(
            "VITE_SUPABASE_PUBLISHABLE_KEY must not contain a Supabase secret key"
        );
    }

    supabaseClient = createClient(url, publishableKey);
    return supabaseClient;
}
