import nationalChampionshipData from "src/raw_data/offline-championships/all_data.csv";
import onlineChampionshipData from "src/raw_data/online-championships/all_data.csv";
import { unsafeEntries } from "~/utils";
import type {
    NationalChampionshipResultsRow,
    OnlineChampionshipResultsRow,
} from "~/components/national-championship/typings";
import {
    placements,
    rareTournamentResults,
    individualTournamentNames,
    type HallOfFameRow,
    type IndividualTournamentName,
} from "~/players/tournament-results";
import { BGAStats } from "~/players/bga-stats";

/** 1 if ASC else -1 */
export type SortDirection = 1 | -1;

export const medalColors = {
    Gold: "#FEE101",
    Silver: "#D7D7D7",
    Bronze: "#824A02",
} as const;

export const computePlayerNames = () => {
    const nationalChampionshipPlayerNames = new Set<string>(
        nationalChampionshipData.map((row) => row.Name)
    );

    const tournamentPlayerNames = new Set<string>();
    Object.values(rareTournamentResults).forEach((resultsArray) =>
        resultsArray.forEach((result) =>
            result.names.forEach((name) => tournamentPlayerNames.add(name))
        )
    );

    const playerNames = [
        ...nationalChampionshipPlayerNames.union(tournamentPlayerNames),
    ];

    return playerNames;
};

export const computeIndividualTournamentDataForPlayersBetweenYears = (
    playerNames: string[],
    minYear: number,
    maxYear: number
) => {
    const BGAUsernames = playerNames.map(
        (name) =>
            BGAStats.find((stat) => stat.name === name)?.bga_username ?? ""
    );

    const playerNameIndices = Object.fromEntries(
        playerNames.map((name, i) => [name, i])
    );

    // Initialize tournament stats
    const tournamentStats: HallOfFameRow[] = playerNames.map((name, i) => {
        const row: Partial<HallOfFameRow> = {
            Name: name,
            BGA_Username: BGAUsernames[i],
        };
        individualTournamentNames.forEach((tournamentName) => {
            placements.forEach((placement) => {
                row[`${tournamentName}${placement}`] = 0;
            });
            row[`${tournamentName}RawData`] = [];
        });

        return row as HallOfFameRow;
    });

    // Compute tournament stats for rare tournaments
    unsafeEntries(rareTournamentResults).forEach(
        ([tournamentName, resultsArray]) => {
            resultsArray.forEach((result) =>
                result.names.forEach((name, j) => {
                    const rank = result.ranks[j];
                    if (result.year >= minYear && result.year <= maxYear) {
                        if (playerNameIndices[name] !== undefined) {
                            tournamentStats[playerNameIndices[name]][
                                `${tournamentName}RawData`
                            ].push({ year: result.year, rank });

                            if (rank.toString() === "1") {
                                tournamentStats[playerNameIndices[name]][
                                    `${tournamentName}Gold`
                                ]++;
                            } else if (rank.toString() === "2") {
                                tournamentStats[playerNameIndices[name]][
                                    `${tournamentName}Silver`
                                ]++;
                            } else if (rank.toString() === "3") {
                                tournamentStats[playerNameIndices[name]][
                                    `${tournamentName}Bronze`
                                ]++;
                            }

                            tournamentStats[playerNameIndices[name]][
                                `${tournamentName}Participation`
                            ]++;
                        }
                    }
                })
            );
        }
    );

    // Compute tournament stats for championships

    updateResultsWithNationalChampionshipDataBetweenYears(
        tournamentStats,
        playerNameIndices,
        minYear,
        maxYear
    );
    updateResultsWithOnlineChampionshipDataBetweenYears(
        tournamentStats,
        playerNameIndices,
        minYear,
        maxYear
    );

    return tournamentStats;
};

export const updateResultsWithNationalChampionshipDataBetweenYears = (
    tournamentStats: HallOfFameRow[],
    playerNameIndices: {
        [k: string]: number;
    },
    minYear: number,
    maxYear: number
) => {
    const filteredData = nationalChampionshipData.filter(
        (row: NationalChampionshipResultsRow) =>
            Number(row.Year) >= minYear && Number(row.Year) <= maxYear
    );

    filteredData.forEach(
        (
            row: NationalChampionshipResultsRow & { ["BGA_Username"]?: string }
        ) => {
            if (playerNameIndices[row.Name] !== undefined) {
                tournamentStats[
                    playerNameIndices[row.Name]
                ].nationalChampionshipRawData.push({
                    year: Number(row.Year),
                    rank: Number(row.Position),
                });
                tournamentStats[playerNameIndices[row.Name]]
                    .nationalChampionshipParticipation++;

                if (row.Position === "1")
                    tournamentStats[playerNameIndices[row.Name]]
                        .nationalChampionshipGold++;
                if (row.Position === "2")
                    tournamentStats[playerNameIndices[row.Name]]
                        .nationalChampionshipSilver++;
                if (row.Position === "3")
                    tournamentStats[playerNameIndices[row.Name]]
                        .nationalChampionshipBronze++;
            }
        }
    );
};

export const updateResultsWithOnlineChampionshipDataBetweenYears = (
    tournamentStats: HallOfFameRow[],
    playerNameIndices: {
        [k: string]: number;
    },
    minYear: number,
    maxYear: number
) => {
    const filteredData = onlineChampionshipData.filter(
        (row) => Number(row.Year) >= minYear && Number(row.Year) <= maxYear
    );

    filteredData.forEach(
        (row: OnlineChampionshipResultsRow & { Name?: string }) => {
            BGAStats.forEach((stat) => {
                if (stat.bga_username === row["BGA_Username"])
                    row.Name = stat.name;
            });
            // If name not known, not add to table
            if (!row.Name) return;
            if (playerNameIndices[row.Name] !== undefined) {
                tournamentStats[
                    playerNameIndices[row.Name]
                ].onlineChampionshipRawData.push({
                    year: Number(row.Year),
                    rank: Number(row.Position),
                });
                tournamentStats[playerNameIndices[row.Name]]
                    .onlineChampionshipParticipation++;
                if (row.Position === "1")
                    tournamentStats[playerNameIndices[row.Name]]
                        .onlineChampionshipGold++;
                if (row.Position === "2")
                    tournamentStats[playerNameIndices[row.Name]]
                        .onlineChampionshipSilver++;
                if (row.Position === "3")
                    tournamentStats[playerNameIndices[row.Name]]
                        .onlineChampionshipBronze++;
            }
        }
    );
};

/** Filter those who have at least one medal or one participation in what is not national championship */
export const filterTournamentStatsRows = (
    tournamentStats: HallOfFameRow[],
    tournamentsVisible: boolean[]
) => {
    return tournamentStats.filter((row) => {
        const sumEntries = individualTournamentNames
            .filter((_, i) => tournamentsVisible[i])
            .map(
                (name) =>
                    row[`${name}Participation`] +
                    row[`${name}Gold`] +
                    row[`${name}Silver`] +
                    row[`${name}Bronze`]
            )
            .reduce((a, b) => a + b, 0);
        const nationalChampionshipVisible =
            tournamentsVisible[
                individualTournamentNames.findIndex(
                    (name) => name === "nationalChampionship"
                )
            ];

        const nationalChampionshipParticipations = nationalChampionshipVisible
            ? row.nationalChampionshipParticipation
            : 0;
        return sumEntries - nationalChampionshipParticipations > 0;
    });
};

/** Radix sort on placements, intending olympic sorting */
export const sortTournamentStats = (
    tournamentStats: HallOfFameRow[],
    sortByTournamentName: IndividualTournamentName,
    sortDirection: SortDirection
) => {
    return tournamentStats
        .sort(
            (row1, row2) =>
                sortDirection *
                (row1[`${sortByTournamentName}Participation`] -
                    row2[`${sortByTournamentName}Participation`])
        )
        .sort(
            (row1, row2) =>
                sortDirection *
                (row1[`${sortByTournamentName}Bronze`] -
                    row2[`${sortByTournamentName}Bronze`])
        )
        .sort(
            (row1, row2) =>
                sortDirection *
                (row1[`${sortByTournamentName}Silver`] -
                    row2[`${sortByTournamentName}Silver`])
        )
        .sort(
            (row1, row2) =>
                sortDirection *
                (row1[`${sortByTournamentName}Gold`] -
                    row2[`${sortByTournamentName}Gold`])
        );
};
