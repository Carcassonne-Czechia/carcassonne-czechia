export interface BGAStat {
    name: string;
    bga_username: string;
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
        id: 84643413,
    },
    {
        name: "Martin Čeliňák",
        bga_username: "martypartyouje",
        id: 85379310,
    },
    {
        name: "Pavel Raus",
        bga_username: "chonps",
        id: 86015756,
    },
    {
        name: "Petra Vidnerová",
        bga_username: "zabza",
        id: 91471532,
    },
    {
        name: "Martin Boreš",
        bga_username: "bormar",
        id: 88672769,
    },
    {
        name: "Jakub Hertl",
        bga_username: "Hurtle_cz",
        id: 84616793,
    },
];
