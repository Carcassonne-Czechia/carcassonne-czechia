export const currentTeamMemberBGAUsernames = [
    "posij118",
    "martypartyouje",
    "Moya88",
    "Hurtle_cz",
    "chonps",
    "Zabza",
    "smoula",
    "farincz",
    "bormar",
    "Simaster 1991",
    "majkls",
    "vomo_43",
    "soustruznice",
    "J0nny",
    "Mejla28",
] as const;

export const formerTeamMemberBGAUsernames = [
    "Eshu_cz",
    "Senvin",
    "Elvid",
    "bassano",
    "DarnCZ",
    "kaspemart",
    "MATY51",
    "wikri",
] as const;

export const otherBGAUsernames = ["Ales84", "Ouki"] as const;

export type CurrentTeamMemberBGAUsername =
    (typeof currentTeamMemberBGAUsernames)[number];
export type FormerTeamMemberBGAUsername =
    (typeof formerTeamMemberBGAUsernames)[number];
export type OtherBGAUsername = (typeof otherBGAUsernames)[number];
export type BGAUsername =
    | CurrentTeamMemberBGAUsername
    | FormerTeamMemberBGAUsername
    | OtherBGAUsername;

export const teamCaptainBGAUsername: CurrentTeamMemberBGAUsername =
    "posij118" as const;
export const formerTeamCaptainBGAUsernames: (
    | CurrentTeamMemberBGAUsername
    | FormerTeamMemberBGAUsername
)[] = ["martypartyouje", "Hurtle_cz"] as const;

export const teamContests = ["WTCOC", "ETCOC"] as const;
export type TeamContest = (typeof teamContests)[number];
export type TeamContestParticipations = `${TeamContest}Participations`;

export const teamCompetitionMembers: Record<
    TeamContest,
    {
        year: number;
        members: BGAUsername[];
    }[]
> = {
    WTCOC: [
        {
            year: 2025,
            members: [
                "bormar",
                "chonps",
                "Hurtle_cz",
                "majkls",
                "martypartyouje",
                "Moya88",
                "posij118",
                "Simaster 1991",
                "smoula",
                "vomo_43",
            ],
        },
        {
            year: 2024,
            members: [
                "bormar",
                "chonps",
                "Hurtle_cz",
                "martypartyouje",
                "Moya88",
                "posij118",
                "Simaster 1991",
                "smoula",
                "vomo_43",
                "wikri",
            ],
        },
        {
            year: 2023,
            members: [
                "bormar",
                "chonps",
                "Hurtle_cz",
                "martypartyouje",
                "Moya88",
                "Simaster 1991",
                "smoula",
                "wikri",
                "Zabza",
            ],
        },
        {
            year: 2022,
            members: [
                "martypartyouje",
                "smoula",
                "bormar",
                "wikri",
                "Hurtle_cz",
                "Moya88",
                "chonps",
                "Zabza",
                "Simaster 1991",
            ],
        },
        {
            year: 2021,
            members: [
                "Hurtle_cz",
                "Moya88",
                "martypartyouje",
                "chonps",
                "bormar",
                "Eshu_cz",
                "Senvin",
                "wikri",
            ],
        },
    ],
    ETCOC: [
        {
            year: 2025,
            members: [
                "chonps",
                "J0nny",
                "martypartyouje",
                "Mejla28",
                "Moya88",
                "posij118",
                "Simaster 1991",
                "smoula",
                "soustruznice",
                "vomo_43",
                "Zabza",
            ],
        },
        {
            year: 2023,
            members: [
                "bormar",
                "chonps",
                "farincz",
                "Hurtle_cz",
                "martypartyouje",
                "Moya88",
                "posij118",
                "Simaster 1991",
                "smoula",
                "Zabza",
            ],
        },
        {
            year: 2021,
            members: [
                "martypartyouje",
                "Moya88",
                "Hurtle_cz",
                "chonps",
                "bormar",
                "Zabza",
                "wikri",
                "smoula",
            ],
        },
        {
            year: 2020,
            members: [
                "Hurtle_cz",
                "Moya88",
                "chonps",
                "Elvid",
                "martypartyouje",
                "bassano",
                "DarnCZ",
                "bormar",
                "kaspemart",
                "MATY51",
            ],
        },
    ],
} as const;
