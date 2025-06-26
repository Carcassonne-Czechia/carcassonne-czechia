import type { BGAUsername } from "./team-members";

export interface BGAStat {
    name?: string;
    bgaUsername: BGAUsername;
    id: number;
    maxElo?: number;
}

export const BGAStats: BGAStat[] = [
    {
        name: "Pavel Hudec",
        bgaUsername: "posij118",
        maxElo: 785,
        id: 90127806,
    },
    {
        name: "Martin Mojžíš",
        bgaUsername: "Moya88",
        maxElo: 700,
        id: 84643413,
    },
    {
        name: "Martin Čeliňák",
        bgaUsername: "martypartyouje",
        maxElo: 700,
        id: 85379310,
    },
    {
        name: "Pavel Raus",
        bgaUsername: "chonps",
        maxElo: 600,
        id: 86015756,
    },
    {
        name: "Petra Vidnerová",
        bgaUsername: "Zabza",
        maxElo: 600,
        id: 91471532,
    },
    {
        name: "Martin Boreš",
        bgaUsername: "bormar",
        maxElo: 500,
        id: 88672769,
    },
    {
        name: "Jakub Hertl",
        bgaUsername: "Hurtle_cz",
        id: 84616793,
        maxElo: 600,
    },
    {
        name: "Martin Kašperlík",
        bgaUsername: "kaspemart",
        id: 88673771,
    },
    {
        bgaUsername: "farincz",
        id: 84935846,
    },
    {
        bgaUsername: "majkls",
        id: 88500055,
        maxElo: 600,
    },
    {
        bgaUsername: "Simaster 1991",
        id: 88803329,
        maxElo: 600,
    },
    {
        name: "Tomáš Novotný",
        bgaUsername: "smoula",
        maxElo: 570,
        id: 84189399,
    },
    {
        bgaUsername: "vomo_43",
        maxElo: 600,
        id: 93570408,
    },
    {
        bgaUsername: "wikri",
        maxElo: 400,
        id: 84673481,
    },
    {
        bgaUsername: "Ales84",
        id: 87427346,
    },
] as const;
