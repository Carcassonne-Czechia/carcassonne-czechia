import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";

export default function PlayerAvatar({
    BGA_Username,
}: {
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
}) {
    return (
        <object
            data={`assets/player-avatars/${BGA_Username}.jpg`}
            type="image/jpeg"
            width={"184px"}
        >
            <img src="assets/logo.jpg" />
        </object>
    );
}
