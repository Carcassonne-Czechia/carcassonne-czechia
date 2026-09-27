import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "~/lib/supabase-client";
import { getPlayerAvatarUrl } from "./player-avatar-url";

export default function PlayerAvatar({
    BGA_Username,
}: {
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
}) {
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
            src={getPlayerAvatarUrl(BGA_Username, profilePicturePath)}
            alt={`${BGA_Username} avatar`}
            width="100%"
            style={{ objectFit: "contain", height: "184px" }}
        />
    );
}
