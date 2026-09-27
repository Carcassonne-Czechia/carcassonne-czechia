import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered, faMedal } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column, type ColumnSortEvent } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import {
    getShortIndividualTournamentName,
    placements,
    type IndividualTournamentName,
    individualTournamentNames,
    type Rank,
} from "~/players/tournament-results";
import BGALink from "../bga-link";
import { useContext, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import {
    computePlayerNames,
    computeIndividualTournamentDataForPlayersBetweenYears,
    filterTournamentStatsRows,
    medalColors,
    sortTournamentStats,
    type HallOfFameData,
} from "../hall-of-fame/compute-hall-of-fame-data";
import { Checkbox } from "primereact/checkbox";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { getSupabaseClient } from "~/lib/supabase-client";

type HallOfFamePlayerDatabaseRow = {
    id: number;
    name: string | null;
    bga_username: string | null;
};

type HallOfFameNationalChampionshipDatabaseRow = {
    year: number;
    position: number;
    name: string;
};

type HallOfFameOnlineChampionshipDatabaseRow = {
    year: number;
    position: number;
    bga_username: string;
};

type HallOfFameTournamentResultDatabaseRow = {
    tournament_name: string;
    year: number;
    player_id: number;
    rank: string;
};

type HallOfFameLoaderData = {
    data: HallOfFameData | null;
    error: string | null;
};

export async function clientLoader(): Promise<HallOfFameLoaderData> {
    const supabase = getSupabaseClient();
    const [nationalResult, onlineResult, playersResult, tournamentResult] =
        await Promise.all([
            supabase
                .from("national_championship")
                .select("year,position,name")
                .order("year")
                .order("position"),
            supabase
                .from("online_championship")
                .select("year,position,bga_username")
                .order("year")
                .order("position"),
            supabase.from("players").select("id,name,bga_username").order("id"),
            supabase
                .from("tournament_results")
                .select("tournament_name,year,player_id,rank")
                .order("tournament_name")
                .order("year")
                .order("player_id"),
        ]);

    const queryError =
        nationalResult.error ??
        onlineResult.error ??
        playersResult.error ??
        tournamentResult.error;
    if (queryError) return { data: null, error: queryError.message };

    const players = (playersResult.data ??
        []) as unknown as HallOfFamePlayerDatabaseRow[];
    const playerNamesById = new Map(
        players
            .filter((player) => player.name)
            .map((player) => [player.id, player.name as string])
    );

    const tournamentResults = (
        (tournamentResult.data ??
            []) as unknown as HallOfFameTournamentResultDatabaseRow[]
    )
        .map((result) => {
            const name = playerNamesById.get(result.player_id);
            if (!name) return null;
            return {
                tournamentName:
                    result.tournament_name as IndividualTournamentName,
                year: result.year,
                name,
                rank: result.rank as Rank,
            };
        })
        .filter(
            (result): result is HallOfFameData["tournamentResults"][number] =>
                result !== null
        );

    return {
        data: {
            players: players.map((player) => ({
                name: player.name,
                bgaUsername: player.bga_username,
            })),
            nationalChampionship: (
                (nationalResult.data ??
                    []) as unknown as HallOfFameNationalChampionshipDatabaseRow[]
            ).map((row) => ({
                year: row.year,
                position: row.position,
                name: row.name,
            })),
            onlineChampionship: (
                (onlineResult.data ??
                    []) as unknown as HallOfFameOnlineChampionshipDatabaseRow[]
            ).map((row) => ({
                year: row.year,
                position: row.position,
                bgaUsername: row.bga_username,
            })),
            tournamentResults,
        },
        error: null,
    };
}

const cartesianProduct = <T, S>(arr1: T[], arr2: S[]): [T, S][] => {
    const result: [T, S][] = [];

    for (const item1 of arr1) {
        for (const item2 of arr2) {
            result.push([item1, item2]);
        }
    }

    return result;
};

const emptyHallOfFameData: HallOfFameData = {
    players: [],
    nationalChampionship: [],
    onlineChampionship: [],
    tournamentResults: [],
};

export default function HallOfFame({
    loaderData,
}: {
    loaderData?: HallOfFameLoaderData;
}) {
    const { lang } = useContext(LangContext);
    const loadedData = loaderData ?? { data: null, error: null };
    const data = loadedData.data ?? emptyHallOfFameData;
    const dataYears = [
        ...new Set([
            ...data.nationalChampionship.map((row) => row.year),
            ...data.onlineChampionship.map((row) => row.year),
            ...data.tournamentResults.map((row) => row.year),
        ]),
    ].sort((year1, year2) => year1 - year2);

    const [minYear, setMinYear] = useState(dataYears[0] ?? 0);
    const [maxYear, setMaxYear] = useState(
        dataYears[dataYears.length - 1] ?? 0
    );
    const [order, setOrder] = useState<0 | 1 | -1 | null | undefined>(-1);
    const [field, setField] = useState<string>("nationalChampionship");

    const [tournamentsVisible, setTournamentsVisible] = useState(
        individualTournamentNames.map((name) => name === "nationalChampionship")
    );

    if (loadedData.error) {
        return (
            <main>
                <h1 className="bg-aquamarine">{DICTIONARY.hallOfFame[lang]}</h1>
                <p>{loadedData.error}</p>
            </main>
        );
    }

    const playerNames = computePlayerNames(data);
    const tournamentStats =
        computeIndividualTournamentDataForPlayersBetweenYears(
            playerNames,
            minYear,
            maxYear,
            data
        );
    const filteredTournamentStats = filterTournamentStatsRows(
        tournamentStats,
        tournamentsVisible
    );
    const initialSortedTournamentStats = sortTournamentStats(
        filteredTournamentStats,
        "nationalChampionship",
        -1
    );

    const tournamentColumnNames = cartesianProduct(
        individualTournamentNames,
        placements
    );

    const sortColumn = (
        e: ColumnSortEvent,
        tournamentName: IndividualTournamentName
    ) => {
        const tournamentStatsCopy = [...filteredTournamentStats];
        return sortTournamentStats(
            tournamentStatsCopy,
            tournamentName,
            e.order === 1 ? 1 : -1
        );
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column
                    header={DICTIONARY.name[lang]}
                    rowSpan={2}
                    field="name"
                    frozen
                />
                <Column
                    header={DICTIONARY.BGA_Username[lang]}
                    rowSpan={2}
                    field="BGA_Username"
                    frozen
                />
                {individualTournamentNames
                    .filter((_, i) => tournamentsVisible[i])
                    .map((tournamentName) => (
                        <Column
                            header={DICTIONARY[tournamentName][lang]}
                            field={tournamentName}
                            colSpan={4}
                            sortable
                            sortFunction={(e) => sortColumn(e, tournamentName)}
                            key={tournamentName}
                        />
                    ))}
            </Row>
            <Row>
                {tournamentColumnNames
                    .filter((_, i) => tournamentsVisible[Math.floor(i / 4)])
                    .map(([tournamentName, placement]) => (
                        <Column
                            sortable
                            header={
                                <FontAwesomeIcon
                                    icon={
                                        placement === "Participation"
                                            ? faFlagCheckered
                                            : faMedal
                                    }
                                    style={
                                        placement !== "Participation"
                                            ? {
                                                  color: medalColors[placement],
                                              }
                                            : {}
                                    }
                                />
                            }
                            field={`${tournamentName}${placement}`}
                        />
                    ))}
            </Row>
        </ColumnGroup>
    );

    return (
        <main>
            <h1 className="bg-aquamarine">{DICTIONARY.hallOfFame[lang]}</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "40rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                        }}
                    >
                        <span>{DICTIONARY.minYear[lang]}:</span>
                    </span>
                    <Dropdown
                        value={minYear}
                        onChange={(e) => setMinYear(e.value)}
                        options={dataYears}
                        optionLabel="year"
                        placeholder="Select start year"
                        style={{ marginRight: "1rem", marginLeft: "0.5rem" }}
                    />
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                        }}
                    >
                        <span>{DICTIONARY.maxYear[lang]}:</span>
                    </span>
                    <Dropdown
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.value)}
                        options={dataYears}
                        optionLabel="year"
                        placeholder="Select end year"
                        style={{ marginRight: "1rem", marginLeft: "0.5rem" }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "left",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                        }}
                    >
                        <span style={{ marginRight: "1rem" }}>
                            {DICTIONARY.includedTournaments[lang]}:
                        </span>
                    </span>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {individualTournamentNames.map((name, i) => {
                            return (
                                <div
                                    key={name}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 600,
                                            marginLeft: "1rem",
                                            marginRight: "0.5rem",
                                        }}
                                    >
                                        <label
                                            htmlFor={`visible-toggler${name}`}
                                        >
                                            {getShortIndividualTournamentName(
                                                name
                                            )}
                                            :
                                        </label>
                                    </span>
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 600,
                                            marginTop: "1rem",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <Checkbox
                                            inputId={`visible-toggler${name}`}
                                            checked={tournamentsVisible[i]}
                                            onChange={(e) =>
                                                setTournamentsVisible(
                                                    (_prev) => {
                                                        const newTournamentsVisible =
                                                            [
                                                                ...tournamentsVisible.slice(
                                                                    0,
                                                                    i
                                                                ),
                                                                e.checked ??
                                                                    false,
                                                                ...tournamentsVisible.slice(
                                                                    i + 1
                                                                ),
                                                            ];

                                                        if (
                                                            newTournamentsVisible.some(
                                                                (x) => x
                                                            )
                                                        )
                                                            return newTournamentsVisible;
                                                        else
                                                            return tournamentsVisible.map(
                                                                (_, j) =>
                                                                    j === i
                                                            );
                                                    }
                                                )
                                            }
                                        />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <DataTable
                value={initialSortedTournamentStats}
                headerColumnGroup={headerGroup}
                stripedRows
                showGridlines
                scrollable
                scrollHeight="400px"
                sortOrder={order}
                sortField={field}
                // Trick to make it impossible to sort in an ascending order
                onSort={(e) => {
                    setOrder(e.sortOrder === 1 ? -1 : 1);
                    setField(e.sortField);
                }}
                // Force rerender on change
                key={JSON.stringify([initialSortedTournamentStats])}
            >
                <Column field="Name" frozen />
                <Column field="BGA_Username" body={BGALink} frozen />
                {tournamentColumnNames
                    .filter((_, i) => tournamentsVisible[Math.floor(i / 4)])
                    .map(([tournamentName, placement]) => {
                        return (
                            <Column
                                field={`${tournamentName}${placement}`}
                                key={`${tournamentName}${placement}`}
                            />
                        );
                    })}
            </DataTable>
        </main>
    );
}
