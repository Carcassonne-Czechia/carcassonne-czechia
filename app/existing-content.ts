import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";

export const HAS_AVATAR: (
    | CurrentTeamMemberBGAUsername
    | FormerTeamMemberBGAUsername
)[] = [] as const;
