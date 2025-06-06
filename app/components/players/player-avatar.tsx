import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import { HAS_AVATAR } from "../../existing-content";
import { BASE_URL } from "~/routes";

export default function PlayerAvatar({
    BGA_Username,
}: {
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
}) {
    const avatarFound = HAS_AVATAR.includes(BGA_Username);

    return (
        <img
            src={
                avatarFound
                    ? `/${BASE_URL}/assets/player-avatars/${BGA_Username}.jpg`
                    : `/${BASE_URL}/assets/logo.jpg`
            }
            alt={`${BGA_Username} avatar`}
            width="100%"
        />
    );
}
