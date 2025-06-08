import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import type { Lang } from "./i18n/lang-context";

type BioMetadata = {
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    langs: Lang[];
};

export const HAS_AVATAR: (
    | CurrentTeamMemberBGAUsername
    | FormerTeamMemberBGAUsername
)[] = [] as const;
