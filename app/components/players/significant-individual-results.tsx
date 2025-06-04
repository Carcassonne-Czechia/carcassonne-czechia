import type { JSX } from "react";
import {
    convertRankToNumber,
    type IndividualTournamentName,
    type IndividualTournamentResult,
    type Rank,
} from "~/players/tournament-results";

export default function SignificantIndividualResults({
    tournamentName,
    results,
    maxPrinted = 5,
}: {
    tournamentName: IndividualTournamentName;
    results: IndividualTournamentResult[];
    maxPrinted?: number;
}) {
    const sortedResults = results.sort(
        (a, b) => convertRankToNumber(a.rank) - convertRankToNumber(b.rank)
    );

    const groupedResults = sortedResults.reduce(
        (acc: { rank: Rank; years: number[] }[], result) => {
            if (acc.length === 0 || acc[acc.length - 1].rank !== result.rank)
                return [...acc, { rank: result.rank, years: [result.year] }];
            else
                return [
                    ...acc.slice(0, acc.length - 1),
                    {
                        rank: result.rank,
                        years: [...acc[acc.length - 1].years, result.year],
                    },
                ];
        },
        []
    );

    let printed = 0;
    const resultString: JSX.Element[] = [];

    for (const result of groupedResults) {
        resultString.push(
            <li>
                <span style={{ fontWeight: 600 }}>
                    {result.rank.toString()}
                </span>
                <span> ({result.years.join(", ")})</span>
            </li>
        );
        printed += result.years.length;
        if (printed > maxPrinted) break;
    }

    return resultString.length === 0 ? (
        <></>
    ) : (
        <div key={tournamentName}>
            <span style={{ fontWeight: 600 }}>{tournamentName}</span>
            <ul>{resultString}</ul>
        </div>
    );
}
