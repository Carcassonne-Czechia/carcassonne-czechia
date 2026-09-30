import type { Session, User } from "@supabase/supabase-js";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { getSupabaseClient } from "./supabase-client";

type AuthContextValue = {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    isEditor: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        let supabase;
        try {
            supabase = getSupabaseClient();
        } catch (clientError) {
            if (active) {
                setError(
                    clientError instanceof Error
                        ? clientError.message
                        : "Supabase configuration is missing."
                );
                setIsLoading(false);
            }
            return () => {
                active = false;
            };
        }

        const loadPermissions = async (currentUser: User | null) => {
            if (!currentUser) {
                if (active) {
                    setIsAdmin(false);
                    setIsEditor(false);
                }
                return;
            }

            const { data, error: permissionError } = await supabase
                .from("user_permissions")
                .select("permission_code")
                .eq("user_id", currentUser.id)
                .in("permission_code", ["admin", "news.edit"]);

            if (active) {
                const permissionCodes = new Set(
                    (data ?? []).map((permission) => permission.permission_code)
                );
                setIsAdmin(permissionCodes.has("admin") && !permissionError);
                setIsEditor(
                    permissionCodes.has("news.edit") && !permissionError
                );
                if (permissionError) {
                    setError(permissionError.message);
                }
            }
        };

        const loadSession = async () => {
            const { data, error: sessionError } =
                await supabase.auth.getSession();
            if (!active) {
                return;
            }

            setSession(data.session);
            if (sessionError) {
                setError(sessionError.message);
            }

            await loadPermissions(data.session?.user ?? null);
            if (active) {
                setIsLoading(false);
            }
        };

        void loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, nextSession) => {
            if (!active) {
                return;
            }

            setSession(nextSession);
            if (event !== "TOKEN_REFRESHED") {
                setIsLoading(true);
            }
            setTimeout(() => {
                void loadPermissions(nextSession?.user ?? null).finally(() => {
                    if (active) {
                        setIsLoading(false);
                    }
                });
            }, 0);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        try {
            const { error: signInError } =
                await getSupabaseClient().auth.signInWithPassword({
                    email,
                    password,
                });
            if (signInError) {
                setError(signInError.message);
                return signInError.message;
            }
            return null;
        } catch (signInError) {
            const message =
                signInError instanceof Error
                    ? signInError.message
                    : "Unable to sign in.";
            setError(message);
            return message;
        }
    };

    const signOut = async () => {
        setError(null);
        try {
            const { error: signOutError } =
                await getSupabaseClient().auth.signOut();
            if (signOutError) {
                setError(signOutError.message);
                return signOutError.message;
            }
            return null;
        } catch (signOutError) {
            const message =
                signOutError instanceof Error
                    ? signOutError.message
                    : "Unable to sign out.";
            setError(message);
            return message;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isLoading,
                isAdmin,
                isEditor,
                error,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
