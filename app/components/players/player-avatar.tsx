import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import { useEffect, useState } from "react";
import { HAS_AVATAR } from "../../existing-content";
import { getSupabaseClient } from "~/lib/supabase-client";

export default function PlayerAvatar({
    BGA_Username,
}: {
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
}) {
    const avatarFound = HAS_AVATAR.includes(BGA_Username);
    const avatarFileName =
        BGA_Username === "_Lyanna_" ? "Lyanna" : BGA_Username;
    const [profilePicturePath, setProfilePicturePath] = useState<string | null>(
        null
    );

    useEffect(() => {
        let active = true;

        const loadProfilePicture = async () => {
            const supabase = getSupabaseClient();
            const { data: player } = await supabase
                .from("players")
                .select("profile_picture_path")
                .eq("bga_username", BGA_Username)
                .maybeSingle();
            if (active) {
                setProfilePicturePath(player?.profile_picture_path ?? null);
            }
        };

        void loadProfilePicture();
        return () => {
            active = false;
        };
    }, [BGA_Username]);

    return (
        <img
            src={
                profilePicturePath ||
                (avatarFound
                    ? `/assets/player-avatars/${avatarFileName}.jpg`
                    : `/assets/logo.jpg`)
            }
            alt={`${BGA_Username} avatar`}
            width="100%"
        />
    );
}
