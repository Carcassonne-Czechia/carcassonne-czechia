// Use for tournaments where only one team member participates

const _rareTournamentNames = [
    "CCL",
    "KoCCup",
    "KoCChampionship",
    "KoCToC",
    "MSO",
] as const;
const _championshipNames = [
    "nationalChampionship",
    "onlineChampionship",
] as const;
export type RareTournamentName = (typeof _rareTournamentNames)[number];
export type ChampionshipName = (typeof _championshipNames)[number];
export const rareTournamentNames: RareTournamentName[] = [
    ..._rareTournamentNames,
] as const;
export const championshipNames: ChampionshipName[] = [
    ..._championshipNames,
] as const;

export type IndividualTournamentName =
    | RareTournamentName
    | ChampionshipName
    | "worldChampionship";
export type Rank = "Q" | "R32" | "R16" | "QF" | "SF" | number;

export const rareTournamentResults: Record<
    RareTournamentName,
    {
        year: number;
        names: string[];
        ranks: Rank[];
        coeffPoints: number[];
    }[]
> &
    Record<
        "worldChampionship",
        {
            year: number;
            names: string[];
            ranks: Rank[];
        }[]
    > = {
    worldChampionship: [
        {
            year: 2006,
            names: ["David Korejtko"],
            ranks: [3],
        },
        {
            year: 2007,
            names: ["Matyáš Veselý"],
            ranks: [8],
        },
        {
            year: 2008,
            names: ["Martin Mojžíš"],
            ranks: [2],
        },
        {
            year: 2009,
            names: ["Martin Mojžíš"],
            ranks: [7],
        },
        {
            year: 2010,
            names: ["Martin Mojžíš"],
            ranks: [2],
        },
        {
            year: 2011,
            names: ["Martin Mojžíš"],
            ranks: [4],
        },
        {
            year: 2012,
            names: ["Martin Mojžíš"],
            ranks: [1],
        },
        {
            year: 2013,
            names: ["Martin Mojžíš", "Václav Regner"],
            ranks: [2, 15],
        },
        {
            year: 2014,
            names: ["Martin Mojžíš"],
            ranks: [5],
        },
        {
            year: 2015,
            names: ["Martin Mojžíš"],
            ranks: [17],
        },
        {
            year: 2016,
            names: ["Martin Mojžíš"],
            ranks: [15],
        },
        {
            year: 2017,
            names: ["Martin Mojžíš", "Martin Kašperlík"],
            ranks: [6, 24],
        },
        {
            year: 2018,
            names: ["Martin Mojžíš"],
            ranks: [6],
        },
        {
            year: 2019,
            names: ["Pavel Hudec"],
            ranks: [14],
        },
        {
            year: 2021,
            names: ["Martin Mojžíš", "Robert Scholz"],
            ranks: [5, 39],
        },
        {
            year: 2022,
            names: ["Martin Mojžíš"],
            ranks: [3],
        },
        {
            year: 2023,
            names: ["Martin Mojžíš"],
            ranks: [23],
        },
        {
            year: 2024,
            names: ["Martin Čeliňák"],
            ranks: [23],
        },
        {
            year: 2025,
            names: ["Pavel Raus"],
            ranks: [10],
        },
    ],

    CCL: [
        {
            year: 2024,
            names: ["Pavel Hudec"],
            ranks: ["R16"],
            coeffPoints: [7],
        },
        {
            year: 2025,
            names: ["Pavel Hudec", "Pavel Raus"],
            ranks: ["QF", "Q"],
            coeffPoints: [13, 3.5],
        },
    ],

    KoCCup: [
        {
            year: 2024,
            names: ["Pavel Hudec"],
            coeffPoints: [5],
            ranks: ["QF"],
        },
    ],
    KoCChampionship: [],
    KoCToC: [
        {
            year: 2024,
            names: ["Pavel Hudec"],
            coeffPoints: [8],
            ranks: [4],
        },
    ],
    MSO: [
        {
            year: 2025,
            names: ["Pavel Hudec"],
            ranks: [3],
            coeffPoints: [9.5],
        },
    ],
} as const;

export const convertRankToNumber = (rank: Rank) => {
    if (typeof rank == "number") return rank;
    switch (rank) {
        case "Q":
            return 40.5;
        case "R32":
            return 24.5;
        case "R16":
            return 12.5;
        case "QF":
            return 6.5;
        case "SF":
            return 3.5;
    }
};

export const individualTournamentNames: IndividualTournamentName[] = (
    ["worldChampionship"] as IndividualTournamentName[]
)
    .concat(championshipNames as IndividualTournamentName[])
    .concat(rareTournamentNames);

export const getShortIndividualTournamentName = (
    name: IndividualTournamentName
) => {
    if (name === "CCL") return "CCL";
    if (name === "nationalChampionship") return "NC";
    if (name === "onlineChampionship") return "NOC";
    if (name === "worldChampionship") return "WC";
    if (name === "KoCChampionship") return "KoCCH";
    if (name === "KoCCup") return "KoCC";
    if (name === "KoCToC") return "KoCToC";
    if (name === "MSO") return "MSO";
};

const _placements = ["Participation", "Gold", "Silver", "Bronze"] as const;
type Placement = (typeof _placements)[number];
export const placements: Placement[] = [..._placements] as const;
export type IndividualTournamentResult = { year: number; rank: Rank };

type IndividualTournamentNamePlacement =
    `${IndividualTournamentName}${Placement}`;
type IndividualTournamentNamePlacementData = Record<
    IndividualTournamentNamePlacement,
    number
> &
    Record<`${IndividualTournamentName}RawData`, IndividualTournamentResult[]>;

export type HallOfFameRow = IndividualTournamentNamePlacementData & {
    Name: string;
    BGA_Username: string;
};
