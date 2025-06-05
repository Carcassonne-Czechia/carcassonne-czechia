/** Note that for CSV files we type as NationalChampionshipResultsRow[] even though the first row is the header row. */
export type NationalChampionshipResultsRow = {
    year: string;
    position: string;
    name: string;
    points: string;
    scoreDifference: string;
};

export type OnlineChampionshipResultsRow = {
    year: string;
    position: string;
    BGA_Username: string;
};

export type NationalChampionshipResultsRowWithUsername =
    NationalChampionshipResultsRow & { BGA_Username: string };

export const nationalChampionshipHeaderRow = [
    "position",
    "name",
    "BGA_Username",
    "points",
    "scoreDifference",
] as const;
