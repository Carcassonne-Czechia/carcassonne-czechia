import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "~/lib/supabase-client";

type Permission = {
    code: string;
    description: string;
};

type AdminUser = {
    userId: string;
    bgaUsername: string | null;
    permissionCodes: string[];
};

type UsersTableProps = {
    currentUserId: string;
};

type Player = {
    id: number;
    bga_username: string | null;
};

type DraftToken = {
    rawToken: string;
    tokenHash: string;
    tokenPrefix: string;
    playerId: number | null;
    bgaUsername: string;
    permissionCodes: string[];
};

type ActiveToken = {
    id: string;
    tokenPrefix: string;
    createdAt: string;
    expiresAt: string;
    playerId: number;
    bgaUsername: string | null;
    permissionCodes: string[];
};

type ProfileRow = {
    user_id: string;
    players?:
        | { bga_username: string | null }
        | { bga_username: string | null }[]
        | null;
};

const registrationUrlStorageKey = "carcassonne.registration-token-urls";

function loadRegistrationUrls() {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const stored = window.sessionStorage.getItem(registrationUrlStorageKey);
        return stored ? (JSON.parse(stored) as Record<string, string>) : {};
    } catch {
        return {};
    }
}

function storeRegistrationUrl(tokenPrefix: string, registrationUrl: string) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const stored = loadRegistrationUrls();
        window.sessionStorage.setItem(
            registrationUrlStorageKey,
            JSON.stringify({
                ...stored,
                [tokenPrefix]: registrationUrl,
            })
        );
    } catch {
        return;
    }
}

export default function UsersTable({ currentUserId }: UsersTableProps) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerSuggestions, setPlayerSuggestions] = useState<Player[]>([]);
    const [draftToken, setDraftToken] = useState<DraftToken | null>(null);
    const [activeTokens, setActiveTokens] = useState<ActiveToken[]>([]);
    const [registrationUrls, setRegistrationUrls] =
        useState<Record<string, string>>(loadRegistrationUrls);
    const [view, setView] = useState<"users" | "tokens">("users");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [tokenSaving, setTokenSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadActiveTokens = async () => {
        const { data, error: functionError } =
            await getSupabaseClient().functions.invoke("admin-registration", {
                body: { action: "list" },
            });
        if (functionError) {
            setError(functionError.message);
            return;
        }
        setActiveTokens((data?.tokens ?? []) as ActiveToken[]);
    };

    const loadUsers = async () => {
        setLoading(true);
        setError(null);

        const supabase = getSupabaseClient();
        const [
            profilesResult,
            userPermissionsResult,
            catalogResult,
            playersResult,
        ] = await Promise.all([
            supabase.from("profiles").select("user_id, players(bga_username)"),
            supabase
                .from("user_permissions")
                .select("user_id, permission_code"),
            supabase
                .from("permission_catalog")
                .select("code, description")
                .order("code"),
            supabase
                .from("players")
                .select("id, bga_username")
                .not("bga_username", "is", null)
                .order("bga_username"),
        ]);

        const firstError =
            profilesResult.error ||
            userPermissionsResult.error ||
            catalogResult.error ||
            playersResult.error;
        if (firstError) {
            setError(firstError.message);
            setLoading(false);
            return;
        }

        const codesByUser = new Map<string, string[]>();
        for (const permission of userPermissionsResult.data ?? []) {
            const codes = codesByUser.get(permission.user_id) ?? [];
            codes.push(permission.permission_code);
            codesByUser.set(permission.user_id, codes);
        }

        const loadedUsers = ((profilesResult.data ?? []) as ProfileRow[])
            .map((profile) => {
                const player = Array.isArray(profile.players)
                    ? profile.players[0]
                    : profile.players;
                return {
                    userId: profile.user_id,
                    bgaUsername: player?.bga_username ?? null,
                    permissionCodes: codesByUser.get(profile.user_id) ?? [],
                };
            })
            .sort((first, second) => {
                const firstName = first.bgaUsername ?? first.userId;
                const secondName = second.bgaUsername ?? second.userId;
                return firstName.localeCompare(secondName);
            });

        setUsers(loadedUsers);
        setPermissions(catalogResult.data ?? []);
        setPlayers((playersResult.data ?? []) as Player[]);
        setLoading(false);
    };

    useEffect(() => {
        void loadUsers();
        void loadActiveTokens();
    }, []);

    const createDraftToken = async () => {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        const rawToken = btoa(String.fromCharCode(...bytes))
            .replaceAll("+", "-")
            .replaceAll("/", "_")
            .replaceAll("=", "");
        const digest = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(rawToken)
        );
        const tokenHash = Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");

        setError(null);
        setDraftToken({
            rawToken,
            tokenHash,
            tokenPrefix: rawToken.slice(0, 8),
            playerId: null,
            bgaUsername: "",
            permissionCodes: [],
        });
        setView("users");
    };

    const submitDraftToken = async () => {
        if (!draftToken) {
            return;
        }

        const selectedPlayer = players.find(
            (player) =>
                player.id === draftToken.playerId &&
                player.bga_username === draftToken.bgaUsername
        );
        if (!selectedPlayer) {
            setError("Select an existing BGA username.");
            return;
        }

        setTokenSaving(true);
        setError(null);
        const { error: functionError } =
            await getSupabaseClient().functions.invoke("admin-registration", {
                body: {
                    action: "create",
                    tokenHash: draftToken.tokenHash,
                    tokenPrefix: draftToken.tokenPrefix,
                    playerId: selectedPlayer.id,
                    permissionCodes: draftToken.permissionCodes,
                },
            });

        if (functionError) {
            setError(functionError.message);
            setTokenSaving(false);
            return;
        }

        const registrationUrl = new URL(
            `/register/token=${draftToken.rawToken}`,
            window.location.origin
        ).toString();
        setRegistrationUrls((current) => ({
            ...current,
            [draftToken.tokenPrefix]: registrationUrl,
        }));
        storeRegistrationUrl(draftToken.tokenPrefix, registrationUrl);
        try {
            await navigator.clipboard.writeText(registrationUrl);
        } catch {
            setError(
                "Token created, but the registration URL could not be copied."
            );
        }
        setDraftToken(null);
        await loadActiveTokens();
        setTokenSaving(false);
    };

    const copyRegistrationUrl = async (tokenPrefix: string) => {
        const registrationUrl = registrationUrls[tokenPrefix];
        if (!registrationUrl) {
            setError(
                "This registration URL is unavailable in the current browser session."
            );
            return;
        }

        try {
            await navigator.clipboard.writeText(registrationUrl);
            setError(null);
        } catch {
            setError("The registration URL could not be copied.");
        }
    };

    const deleteActiveToken = async (tokenId: string) => {
        setTokenSaving(true);
        setError(null);
        const { error: functionError } =
            await getSupabaseClient().functions.invoke("admin-registration", {
                body: { action: "delete", id: tokenId },
            });
        if (functionError) {
            setError(functionError.message);
        } else {
            await loadActiveTokens();
        }
        setTokenSaving(false);
    };

    const updateDraftPermission = (
        permissionCode: string,
        checked: boolean
    ) => {
        setDraftToken((current) => {
            if (!current) {
                return current;
            }
            return {
                ...current,
                permissionCodes:
                    checked && permissionCode === "admin"
                        ? permissions.map((permission) => permission.code)
                        : checked
                          ? [...current.permissionCodes, permissionCode]
                          : current.permissionCodes.filter(
                                (code) => code !== permissionCode
                            ),
            };
        });
    };

    const togglePermission = async (
        targetUser: AdminUser,
        permissionCode: string,
        checked: boolean
    ) => {
        const targetIsAdmin = targetUser.permissionCodes.includes("admin");
        if (targetIsAdmin || saving) {
            return;
        }

        setSaving(`${targetUser.userId}:${permissionCode}`);
        setError(null);
        const supabase = getSupabaseClient();
        let operationError = null;

        if (checked && permissionCode === "admin") {
            const permissionRows = permissions.map((permission) => ({
                user_id: targetUser.userId,
                permission_code: permission.code,
                granted_by: currentUserId,
            }));
            const result = await supabase
                .from("user_permissions")
                .upsert(permissionRows, {
                    onConflict: "user_id,permission_code",
                });
            operationError = result.error;
        } else if (checked) {
            const result = await supabase.from("user_permissions").insert({
                user_id: targetUser.userId,
                permission_code: permissionCode,
                granted_by: currentUserId,
            });
            operationError = result.error;
        } else {
            const result = await supabase
                .from("user_permissions")
                .delete()
                .eq("user_id", targetUser.userId)
                .eq("permission_code", permissionCode);
            operationError = result.error;
        }

        if (operationError) {
            setError(operationError.message);
        } else {
            await loadUsers();
        }
        setSaving(null);
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div className="admin-users">
            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}
            <div className="admin-users-toolbar">
                <div className="admin-users-tabs" role="tablist">
                    <button
                        className={view === "users" ? "active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={view === "users"}
                        onClick={() => setView("users")}
                    >
                        Users
                    </button>
                    <button
                        className={view === "tokens" ? "active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={view === "tokens"}
                        onClick={() => setView("tokens")}
                    >
                        Active tokens ({activeTokens.length})
                    </button>
                </div>
                {view === "users" && (
                    <Button
                        type="button"
                        label={draftToken ? "Submit" : undefined}
                        icon={draftToken ? "pi pi-check" : "pi pi-plus"}
                        text
                        disabled={
                            draftToken ? tokenSaving : activeTokens.length > 0
                        }
                        aria-label={
                            draftToken
                                ? "Submit registration token"
                                : "Create registration token"
                        }
                        title={
                            draftToken
                                ? "Submit registration token"
                                : "Create registration token"
                        }
                        onClick={() =>
                            void (draftToken
                                ? submitDraftToken()
                                : createDraftToken())
                        }
                    />
                )}
            </div>
            {view === "users" ? (
                <div className="admin-users-table-wrapper">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th scope="col">BGA username</th>
                                {permissions.map((permission) => (
                                    <th scope="col" key={permission.code}>
                                        <span title={permission.description}>
                                            {permission.code}
                                        </span>
                                    </th>
                                ))}
                                {draftToken && <th scope="col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {draftToken && (
                                <tr className="admin-registration-draft-row">
                                    <th scope="row">
                                        <AutoComplete
                                            value={draftToken.bgaUsername}
                                            suggestions={playerSuggestions}
                                            field="bga_username"
                                            forceSelection
                                            placeholder="BGA username"
                                            completeMethod={(event) => {
                                                const query =
                                                    event.query.toLowerCase();
                                                setPlayerSuggestions(
                                                    players.filter((player) =>
                                                        player.bga_username
                                                            ?.toLowerCase()
                                                            .includes(query)
                                                    )
                                                );
                                            }}
                                            onChange={(event) => {
                                                const selected = event.value as
                                                    | Player
                                                    | string
                                                    | null;
                                                const selectedPlayer =
                                                    typeof selected === "object"
                                                        ? selected
                                                        : players.find(
                                                              (player) =>
                                                                  player.bga_username ===
                                                                  selected
                                                          );
                                                setDraftToken((current) =>
                                                    current
                                                        ? {
                                                              ...current,
                                                              playerId:
                                                                  selectedPlayer?.id ??
                                                                  null,
                                                              bgaUsername:
                                                                  selectedPlayer?.bga_username ??
                                                                  (typeof selected ===
                                                                  "string"
                                                                      ? selected
                                                                      : ""),
                                                          }
                                                        : current
                                                );
                                            }}
                                        />
                                    </th>
                                    {permissions.map((permission) => (
                                        <td key={permission.code}>
                                            <Checkbox
                                                inputId={`draft-${permission.code}`}
                                                checked={draftToken.permissionCodes.includes(
                                                    permission.code
                                                )}
                                                onChange={(event) =>
                                                    updateDraftPermission(
                                                        permission.code,
                                                        event.checked ?? false
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            rounded
                                            text
                                            severity="danger"
                                            disabled={tokenSaving}
                                            aria-label="Discard registration token"
                                            title="Discard registration token"
                                            onClick={() => setDraftToken(null)}
                                        />
                                    </td>
                                </tr>
                            )}
                            {users.map((targetUser) => {
                                const targetIsAdmin =
                                    targetUser.permissionCodes.includes(
                                        "admin"
                                    );
                                return (
                                    <tr key={targetUser.userId}>
                                        <th scope="row">
                                            <span>
                                                {targetUser.bgaUsername ??
                                                    "No BGA account"}
                                            </span>
                                            <small>{targetUser.userId}</small>
                                        </th>
                                        {permissions.map((permission) => {
                                            const checked =
                                                targetUser.permissionCodes.includes(
                                                    permission.code
                                                );
                                            const disabled =
                                                targetIsAdmin ||
                                                saving !== null;
                                            return (
                                                <td key={permission.code}>
                                                    <Checkbox
                                                        inputId={`${targetUser.userId}-${permission.code}`}
                                                        checked={checked}
                                                        disabled={disabled}
                                                        onChange={(event) =>
                                                            void togglePermission(
                                                                targetUser,
                                                                permission.code,
                                                                event.checked ??
                                                                    false
                                                            )
                                                        }
                                                    />
                                                </td>
                                            );
                                        })}
                                        {draftToken && <td />}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="admin-users-table-wrapper">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th scope="col">BGA username</th>
                                <th scope="col">Permissions</th>
                                <th scope="col">Expires</th>
                                <th scope="col">Copy</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTokens.map((token) => (
                                <tr key={token.id}>
                                    <th scope="row">
                                        {token.bgaUsername ?? "No BGA account"}
                                    </th>
                                    <td>{token.permissionCodes.join(", ")}</td>
                                    <td>
                                        {new Date(
                                            token.expiresAt
                                        ).toLocaleString()}
                                    </td>
                                    <td>
                                        <Button
                                            type="button"
                                            icon="pi pi-copy"
                                            rounded
                                            text
                                            disabled={
                                                tokenSaving ||
                                                !registrationUrls[
                                                    token.tokenPrefix
                                                ]
                                            }
                                            aria-label="Copy registration URL"
                                            title="Copy registration URL"
                                            onClick={() =>
                                                void copyRegistrationUrl(
                                                    token.tokenPrefix
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            rounded
                                            text
                                            severity="danger"
                                            disabled={tokenSaving}
                                            aria-label="Delete registration token"
                                            title="Delete registration token"
                                            onClick={() =>
                                                void deleteActiveToken(token.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
