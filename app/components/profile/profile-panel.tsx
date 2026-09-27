import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import Markdown from "react-markdown";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { getSupabaseClient } from "~/lib/supabase-client";

type ProfileForm = {
    bgaUsername: string;
    name: string;
    phoneNumber: string;
    bio: string;
    profilePicturePath: string;
};

type PlayerRelation = {
    name: string | null;
    bga_username: string | null;
    bio: string | null;
    profile_picture_path: string | null;
};

type ProfileRow = {
    player_id: number | null;
    phone_number: string | null;
    players: PlayerRelation | PlayerRelation[] | null;
};

const emptyForm: ProfileForm = {
    bgaUsername: "",
    name: "",
    phoneNumber: "",
    bio: "",
    profilePicturePath: "",
};

function imageExtension(file: File) {
    return file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase() || "jpg"
        : "jpg";
}

export default function ProfilePanel({ userId }: { userId: string }) {
    const { lang } = useContext(LangContext);
    const [form, setForm] = useState<ProfileForm>(emptyForm);
    const [playerId, setPlayerId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            const { data, error: loadError } = await getSupabaseClient()
                .from("profiles")
                .select(
                    "player_id, phone_number, players(name, bga_username, bio, profile_picture_path)"
                )
                .eq("user_id", userId)
                .maybeSingle();

            if (!active) {
                return;
            }

            if (loadError || !data) {
                setError(loadError?.message || "Profile not found.");
                setLoading(false);
                return;
            }

            const profile = data as ProfileRow;
            const player = Array.isArray(profile.players)
                ? profile.players[0]
                : profile.players;
            setPlayerId(profile.player_id);
            setForm({
                bgaUsername: player?.bga_username || "",
                name: player?.name || "",
                phoneNumber: profile.phone_number || "",
                bio: player?.bio || "",
                profilePicturePath: player?.profile_picture_path || "",
            });
            setLoading(false);
        };

        void loadProfile();
        return () => {
            active = false;
        };
    }, [userId]);

    const updateField = (field: keyof ProfileForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setSaved(false);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file && !file.type.startsWith("image/")) {
            setError(
                lang === "cs"
                    ? "Vyberte prosím obrázek."
                    : "Please choose an image file."
            );
            return;
        }

        setError(null);
        setSaved(false);
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (playerId !== null && !form.bgaUsername.trim()) {
            setError(
                lang === "cs"
                    ? "Jméno na BGA je povinné."
                    : "BGA username is required."
            );
            return;
        }

        setSaving(true);
        setSaved(false);
        setError(null);
        const supabase = getSupabaseClient();
        let profilePicturePath = form.profilePicturePath.trim() || null;

        if (imageFile) {
            const imagePath = `${userId}/${crypto.randomUUID()}.${imageExtension(imageFile)}`;
            const { error: uploadError } = await supabase.storage
                .from("player-avatars")
                .upload(imagePath, imageFile, {
                    cacheControl: "3600",
                    contentType: imageFile.type,
                    upsert: false,
                });
            if (uploadError) {
                setError(uploadError.message);
                setSaving(false);
                return;
            }

            profilePicturePath = supabase.storage
                .from("player-avatars")
                .getPublicUrl(imagePath).data.publicUrl;
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                phone_number: form.phoneNumber.trim() || null,
            })
            .eq("user_id", userId);
        if (profileError) {
            setError(profileError.message);
            setSaving(false);
            return;
        }

        if (playerId !== null) {
            const { error: playerError } = await supabase
                .from("players")
                .update({
                    name: form.name.trim() || null,
                    bga_username: form.bgaUsername.trim(),
                    bio: form.bio.trim() || null,
                    profile_picture_path: profilePicturePath,
                })
                .eq("id", playerId);
            if (playerError) {
                setError(playerError.message);
                setSaving(false);
                return;
            }
        }

        setForm((current) => ({
            ...current,
            bgaUsername: form.bgaUsername.trim(),
            name: form.name.trim(),
            phoneNumber: form.phoneNumber.trim(),
            bio: form.bio.trim(),
            profilePicturePath: profilePicturePath || "",
        }));
        setImageFile(null);
        setImagePreview(null);
        setSaved(true);
        setSaving(false);
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <form className="profile-panel" onSubmit={handleSubmit}>
            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}
            {saved && (
                <p className="profile-success" role="status">
                    {DICTIONARY.profileSaved[lang]}
                </p>
            )}
            <div className="profile-avatar-field">
                <img
                    className="profile-avatar-preview"
                    src={
                        imagePreview ||
                        form.profilePicturePath ||
                        "/assets/logo.jpg"
                    }
                    alt={DICTIONARY.playerAvatar[lang]}
                />
                <label htmlFor="profile-avatar">
                    {DICTIONARY.playerAvatar[lang]}
                </label>
                <input
                    id="profile-avatar"
                    type="file"
                    accept="image/*"
                    disabled={playerId === null || saving}
                    onChange={handleImageChange}
                />
            </div>
            <label htmlFor="profile-bga-username">
                {DICTIONARY.BGA_Username[lang]}
            </label>
            <InputText
                id="profile-bga-username"
                disabled={playerId === null}
                value={form.bgaUsername}
                onChange={(event) =>
                    updateField("bgaUsername", event.target.value)
                }
            />
            <label htmlFor="profile-name">{DICTIONARY.name[lang]}</label>
            <InputText
                id="profile-name"
                disabled={playerId === null}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
            />
            <label htmlFor="profile-phone">
                {DICTIONARY.phoneNumber[lang]}
            </label>
            <InputText
                id="profile-phone"
                value={form.phoneNumber}
                onChange={(event) =>
                    updateField("phoneNumber", event.target.value)
                }
            />
            <label htmlFor="profile-bio">
                {DICTIONARY.bio[lang]} (Markdown)
            </label>
            <InputTextarea
                id="profile-bio"
                value={form.bio}
                disabled={playerId === null || saving}
                onChange={(event) => updateField("bio", event.target.value)}
                rows={8}
                autoResize
            />
            <p className="news-markdown-hint">
                {DICTIONARY.markdownHint[lang]}
            </p>
            {form.bio && (
                <div className="profile-bio-preview">
                    <Markdown>{form.bio}</Markdown>
                </div>
            )}
            <Button
                type="submit"
                label={DICTIONARY.save[lang]}
                icon="pi pi-check"
                loading={saving}
            />
        </form>
    );
}
