/** Note that for CSV files we type as NationalChampionshipResultsRow[] even though the first row is the header row. */
export type NationalChampionshipResultsRow = {
    Year: string;
    Position: string;
    Name: string;
    Points: string;
    "Score difference": string;
};

export type OnlineChampionshipResultsRow = {
    Year: string;
    Position: string;
    BGA_Username: string;
};

export type NationalChampionshipResultsRowWithUsername =
    NationalChampionshipResultsRow & { BGA_Username: string };

export const nationalChampionshipHeaderRow = [
    "Position",
    "Name",
    "BGA_Username",
    "Points",
    "Score Difference",
] as const;
