import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, type JSX } from "react";
import {
    convertRankToNumber,
    type IndividualTournamentName,
    type IndividualTournamentResult,
    type Rank,
} from "~/players/tournament-results";
import { getOrdinalNumber } from "~/utils";
import { medalColors } from "../hall-of-fame/compute-hall-of-fame-data";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";

export default function SignificantIndividualResults({
    tournamentName,
    results,
    maxPrinted = 5,
}: {
    tournamentName: IndividualTournamentName;
    results: IndividualTournamentResult[];
    maxPrinted?: number;
}) {
    const { lang } = useContext(LangContext);

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
            <li key={result.rank}>
                <span style={{ fontWeight: 600 }}>
                    {lang === "en"
                        ? getOrdinalNumber(result.rank)
                        : result.rank.toString() + "."}
                </span>
                {Object.entries(medalColors).map(([_, colorHex], i) => {
                    return result.rank === i + 1 ? (
                        <FontAwesomeIcon
                            icon={faMedal}
                            style={{
                                color: colorHex,

                                marginLeft: "2px",
                            }}
                            key={i}
                        />
                    ) : (
                        <React.Fragment key={i}></React.Fragment>
                    );
                })}

                <span style={{ marginLeft: "" }}>
                    {" "}
                    ({result.years.join(", ")})
                </span>
            </li>
        );
        printed += result.years.length;
        if (printed > maxPrinted) break;
    }

    return resultString.length === 0 ? (
        <></>
    ) : (
        <div key={tournamentName}>
            <span style={{ fontWeight: 600 }}>
                {DICTIONARY[tournamentName][lang]}:
            </span>
            <ul>{resultString}</ul>
        </div>
    );
}
