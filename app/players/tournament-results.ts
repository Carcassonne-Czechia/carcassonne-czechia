// Use for tournaments where only one team member participates

const _rareTournamentNames = ["worldChampionship", "CCL"] as const;
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

export type TournamentName = RareTournamentName | ChampionshipName;

export const rareTournamentResults: Record<
    RareTournamentName,
    {
        year: number;
        names: string[];
        ranks: (number | string)[];
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
    ],

    CCL: [
        {
            year: 2024,
            names: ["Pavel Hudec"],
            ranks: ["Round of 16"],
        },
        {
            year: 2025,
            names: ["Pavel Hudec", "Pavel Raus"],
            ranks: ["Quarter finals", "Qualification"],
        },
    ],
} as const;

export const tournamentNames: TournamentName[] = (
    championshipNames as TournamentName[]
).concat(rareTournamentNames);

export const getShortTournamentName = (name: TournamentName) => {
    if (name == "CCL") return "CCL";
    if (name == "nationalChampionship") return "NC";
    if (name == "onlineChampionship") return "NOC";
    if (name == "worldChampionship") return "WC";
};

const _placements = ["Participation", "Gold", "Silver", "Bronze"] as const;
type Placement = (typeof _placements)[number];
export const placements: Placement[] = [..._placements] as const;

export type TournamentNamePlacement = `${TournamentName}${Placement}`;
type TournamentNamePlacementNumber = {
    [Property in TournamentNamePlacement]: number;
};

export type HallOfFameRow = TournamentNamePlacementNumber & {
    Name: string;
    BGA_Username: string;
};
