import type {
    CurrentTeamMemberBGAUsername,
    FormerTeamMemberBGAUsername,
} from "./team-members";

export interface BGAStat {
    name?: string;
    bga_username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    id: number;
    max_elo?: number;
}

export const BGAStats: BGAStat[] = [
    {
        name: "Pavel Hudec",
        bga_username: "posij118",
        max_elo: 785,
        id: 90127806,
    },
    {
        name: "Martin Mojžíš",
        bga_username: "Moya88",
        max_elo: 700,
        id: 84643413,
    },
    {
        name: "Martin Čeliňák",
        bga_username: "martypartyouje",
        max_elo: 700,
        id: 85379310,
    },
    {
        name: "Pavel Raus",
        bga_username: "chonps",
        max_elo: 600,
        id: 86015756,
    },
    {
        name: "Petra Vidnerová",
        bga_username: "Zabza",
        max_elo: 600,
        id: 91471532,
    },
    {
        name: "Martin Boreš",
        bga_username: "bormar",
        max_elo: 500,
        id: 88672769,
    },
    {
        name: "Jakub Hertl",
        bga_username: "Hurtle_cz",
        id: 84616793,
        max_elo: 600,
    },
    {
        name: "Martin Kašperlík",
        bga_username: "kaspemart",
        id: 88673771,
    },
    {
        bga_username: "farincz",
        id: 84935846,
    },
    {
        bga_username: "majkls",
        id: 88500055,
        max_elo: 600,
    },
    {
        bga_username: "Simaster 1991",
        id: 88803329,
        max_elo: 600,
    },
    {
        bga_username: "smoula",
        max_elo: 500,
        id: 84189399,
    },
    {
        bga_username: "vomo_43",
        max_elo: 600,
        id: 93570408,
    },
    {
        bga_username: "wikri",
        max_elo: 400,
        id: 84673481,
    },
] as const;
