import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useEffect, useState, type ChangeEvent } from "react";
import BGALink from "~/components/bga-link";
import { getPlayerAvatarUrl } from "~/components/players/player-avatar-url";
import { getSupabaseClient } from "~/lib/supabase-client";

type Player = {
    id: number;
    name: string | null;
    bga_username: string | null;
    bga_id: number | null;
    national_team_membership_current: boolean;
    national_team_membership_former: boolean;
    bio: string | null;
    profile_picture_path: string | null;
};

type PlayerValues = Pick<
    Player,
    | "name"
    | "bga_username"
    | "bga_id"
    | "national_team_membership_current"
    | "national_team_membership_former"
    | "profile_picture_path"
>;

const playerColumns = [
    "name",
    "bga_username",
    "bga_id",
    "national_team_membership_current",
    "national_team_membership_former",
    "bio",
    "profile_picture_path",
] as const;

function emptyPlayer(): PlayerValues {
    return {
        name: "",
        bga_username: "",
        bga_id: null,
        national_team_membership_current: false,
        national_team_membership_former: false,
        profile_picture_path: null,
    };
}

function normalize(value: string | null) {
    return value?.trim().toLocaleLowerCase() ?? "";
}

function playerSelect() {
    return ["id", ...playerColumns].join(", ");
}

function parseBgaId(value: string) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isSafeInteger(parsedValue) && parsedValue >= 0
        ? parsedValue
        : null;
}

export default function PlayersTable() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [draftPlayer, setDraftPlayer] = useState<PlayerValues | null>(null);
    const [editedPlayers, setEditedPlayers] = useState<
        Record<number, PlayerValues>
    >({});
    const [avatarFiles, setAvatarFiles] = useState<Record<number, File | null>>(
        {}
    );
    const [avatarPreviews, setAvatarPreviews] = useState<
        Record<number, string>
    >({});
    const [viewedPlayers, setViewedPlayers] = useState<Player[]>([]);
    const [currentOnly, setCurrentOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | "draft" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadPlayers = async () => {
        setLoading(true);
        setError(null);
        const supabase = getSupabaseClient();
        const playersResult = await supabase
            .from("players")
            .select(playerSelect())
            .order("bga_username");

        if (playersResult.error) {
            setError(playersResult.error.message || "Unable to load players.");
            setLoading(false);
            return;
        }

        const loadedPlayers = (
            (playersResult.data ?? []) as unknown as Array<Player>
        ).map((player) => {
            return {
                ...player,
            };
        });
        setPlayers(loadedPlayers);
        setViewedPlayers(
            loadedPlayers.filter((player) => player.bga_username !== null)
        );
        setEditedPlayers({});
        setAvatarFiles({});
        setAvatarPreviews({});
        setLoading(false);
    };

    useEffect(() => {
        void loadPlayers();
    }, []);

    const updateDraft = (values: Partial<PlayerValues>) => {
        setDraftPlayer((current) =>
            current ? { ...current, ...values } : current
        );
    };

    const updatePlayer = (player: Player, values: Partial<PlayerValues>) => {
        setEditedPlayers((current) => ({
            ...current,
            [player.id]: {
                ...(current[player.id] ?? player),
                ...values,
            },
        }));
    };

    const validateValues = (
        values: PlayerValues,
        options: { requireUniqueUsername: boolean }
    ) => {
        const username = values.bga_username?.trim() ?? "";
        const bgaId = values.bga_id;
        if (!username) {
            return "BGA username is required.";
        }
        if (!Number.isSafeInteger(bgaId) || bgaId === null || bgaId < 0) {
            return "BGA ID must be a non-negative integer.";
        }
        if (
            options.requireUniqueUsername &&
            players.some(
                (player) =>
                    normalize(player.bga_username) === normalize(username)
            )
        ) {
            return "This BGA username is already assigned to a player.";
        }
        return null;
    };

    const displayedPlayers = viewedPlayers.filter(
        (player) => !currentOnly || player.national_team_membership_current
    );

    const submitDraft = async () => {
        if (!draftPlayer) {
            return;
        }

        const validationError = validateValues(draftPlayer, {
            requireUniqueUsername: true,
        });
        if (validationError) {
            setError(validationError);
            return;
        }

        const normalizedName = normalize(draftPlayer.name);
        const matchingPlayer = normalizedName
            ? players.find(
                  (player) => normalize(player.name) === normalizedName
              )
            : null;
        if (matchingPlayer?.bga_username) {
            setError("A player with this name already has a BGA username.");
            return;
        }

        setSaving("draft");
        setError(null);
        const values = {
            ...draftPlayer,
            name: draftPlayer.name?.trim() || null,
            bga_username: draftPlayer.bga_username?.trim() ?? "",
            bga_id: draftPlayer.bga_id ?? null,
        };
        const query = matchingPlayer
            ? getSupabaseClient()
                  .from("players")
                  .update(values)
                  .eq("id", matchingPlayer.id)
            : getSupabaseClient().from("players").insert(values);
        const { error: saveError } = await query;

        if (saveError) {
            setError(saveError.message);
        } else {
            setDraftPlayer(null);
            await loadPlayers();
        }
        setSaving(null);
    };

    const savePlayer = async (player: Player) => {
        const values = editedPlayers[player.id];
        if (!values) {
            return;
        }

        const validationError = validateValues(values, {
            requireUniqueUsername: false,
        });
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(player.id);
        setError(null);
        const supabase = getSupabaseClient();
        let profilePicturePath = player.profile_picture_path;
        const avatarFile = avatarFiles[player.id];
        if (avatarFile) {
            const extension = avatarFile.name.includes(".")
                ? avatarFile.name.split(".").pop()?.toLowerCase() || "jpg"
                : "jpg";
            const avatarPath = `${player.id}/${crypto.randomUUID()}.${extension}`;
            const { error: uploadError } = await supabase.storage
                .from("player-avatars")
                .upload(avatarPath, avatarFile, {
                    cacheControl: "3600",
                    contentType: avatarFile.type,
                    upsert: false,
                });
            if (uploadError) {
                setError(uploadError.message);
                setSaving(null);
                return;
            }

            profilePicturePath = supabase.storage
                .from("player-avatars")
                .getPublicUrl(avatarPath).data.publicUrl;
        }

        const { error: saveError } = await supabase
            .from("players")
            .update({
                name: values.name?.trim() || null,
                bga_id: values.bga_id ?? null,
                national_team_membership_current:
                    values.national_team_membership_current,
                national_team_membership_former:
                    values.national_team_membership_former,
                profile_picture_path: profilePicturePath,
            })
            .eq("id", player.id);

        if (saveError) {
            setError(saveError.message);
        } else {
            await loadPlayers();
        }
        setSaving(null);
    };

    const handleAvatarChange = (
        player: Player,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;
        if (file && !file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }

        setError(null);
        setAvatarFiles((current) => ({ ...current, [player.id]: file }));
        setAvatarPreviews((current) => ({
            ...current,
            [player.id]: file ? URL.createObjectURL(file) : "",
        }));
        updatePlayer(player, {});
    };

    if (loading) {
        return <p>Loading players...</p>;
    }

    return (
        <div className="admin-players">
            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}
            <div className="admin-players-toolbar">
                <span>
                    {viewedPlayers.length}{" "}
                    {viewedPlayers.length === 1 ? "player" : "players"} with BGA
                    accounts
                </span>
                <div className="admin-players-toolbar-actions">
                    <label>
                        <Checkbox
                            checked={currentOnly}
                            onChange={(event) =>
                                setCurrentOnly(event.checked ?? false)
                            }
                        />
                        Current national team only
                    </label>
                    <Button
                        type="button"
                        label={draftPlayer ? "Submit" : undefined}
                        icon={draftPlayer ? "pi pi-check" : "pi pi-plus"}
                        text
                        disabled={saving !== null}
                        aria-label={
                            draftPlayer ? "Submit player" : "Add player"
                        }
                        title={draftPlayer ? "Submit player" : "Add player"}
                        style={{ padding: "0 0.5rem", marginBottom: 0 }}
                        onClick={() =>
                            void (draftPlayer
                                ? submitDraft()
                                : setDraftPlayer(emptyPlayer()))
                        }
                    />
                </div>
            </div>
            <div className="admin-users-table-wrapper">
                <table className="admin-users-table admin-players-table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">BGA username</th>
                            <th scope="col">BGA ID</th>
                            <th scope="col">Current national team</th>
                            <th scope="col">Former national team</th>
                            <th scope="col">Avatar</th>
                            <th scope="col">Save</th>
                        </tr>
                    </thead>
                    <tbody>
                        {draftPlayer && (
                            <tr
                                className="admin-registration-draft-row"
                                key="draft"
                            >
                                <td>
                                    <InputText
                                        value={draftPlayer.name ?? ""}
                                        placeholder="Name (optional)"
                                        onChange={(event) =>
                                            updateDraft({
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <InputText
                                        value={draftPlayer.bga_username ?? ""}
                                        placeholder="BGA username"
                                        onChange={(event) =>
                                            updateDraft({
                                                bga_username:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <InputText
                                        type="number"
                                        value={
                                            draftPlayer.bga_id?.toString() ?? ""
                                        }
                                        placeholder="BGA ID"
                                        onChange={(event) =>
                                            updateDraft({
                                                bga_id: parseBgaId(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        checked={
                                            draftPlayer.national_team_membership_current
                                        }
                                        onChange={(event) =>
                                            updateDraft({
                                                national_team_membership_current:
                                                    event.checked ?? false,
                                            })
                                        }
                                    />
                                </td>
                                <td />
                                <td>
                                    <Checkbox
                                        checked={
                                            draftPlayer.national_team_membership_former
                                        }
                                        onChange={(event) =>
                                            updateDraft({
                                                national_team_membership_former:
                                                    event.checked ?? false,
                                            })
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
                                        disabled={saving !== null}
                                        aria-label="Discard player"
                                        title="Discard player"
                                        onClick={() => setDraftPlayer(null)}
                                    />
                                </td>
                            </tr>
                        )}
                        {displayedPlayers.map((player) => {
                            const values = editedPlayers[player.id] ?? player;
                            const isEdited =
                                editedPlayers[player.id] !== undefined;
                            return (
                                <tr key={player.id}>
                                    <td>
                                        <InputText
                                            value={values.name ?? ""}
                                            onChange={(event) =>
                                                updatePlayer(player, {
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        {player.bga_username && (
                                            <BGALink
                                                BGA_Username={
                                                    player.bga_username
                                                }
                                                BGA_ID={player.bga_id}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <InputText
                                            type="number"
                                            value={
                                                values.bga_id?.toString() ?? ""
                                            }
                                            onChange={(event) =>
                                                updatePlayer(player, {
                                                    bga_id: parseBgaId(
                                                        event.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            checked={
                                                values.national_team_membership_current
                                            }
                                            onChange={(event) =>
                                                updatePlayer(player, {
                                                    national_team_membership_current:
                                                        event.checked ?? false,
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            checked={
                                                values.national_team_membership_former
                                            }
                                            onChange={(event) =>
                                                updatePlayer(player, {
                                                    national_team_membership_former:
                                                        event.checked ?? false,
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <label className="admin-player-avatar-picker">
                                            <img
                                                src={
                                                    avatarPreviews[player.id] ||
                                                    getPlayerAvatarUrl(
                                                        player.bga_username,
                                                        player.profile_picture_path
                                                    )
                                                }
                                                alt=""
                                                className="admin-player-avatar-preview"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={saving !== null}
                                                onChange={(event) =>
                                                    handleAvatarChange(
                                                        player,
                                                        event
                                                    )
                                                }
                                            />
                                        </label>
                                    </td>
                                    <td className="admin-players-save-cell">
                                        <Button
                                            type="button"
                                            icon="pi pi-save"
                                            rounded
                                            text
                                            disabled={
                                                !isEdited || saving !== null
                                            }
                                            aria-label="Save player"
                                            title="Save player"
                                            onClick={() =>
                                                void savePlayer(player)
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
