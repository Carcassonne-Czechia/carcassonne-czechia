import nationalChampionshipData from "src/raw-data/offline-championships/all_data.csv";
import onlineChampionshipData from "src/raw-data/online-championships/all_data.csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered, faMedal } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column, type ColumnSortEvent } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import {
    getShortIndividualTournamentName,
    placements,
    rareTournamentNames,
    rareTournamentResults,
    type IndividualTournamentName,
    individualTournamentNames,
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
} from "./compute-hall-of-fame-data";
import { Checkbox } from "primereact/checkbox";
import NationalChampionshipNavigation from "./navigation";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";

const cartesianProduct = <T, S>(arr1: T[], arr2: S[]): [T, S][] => {
    const result: [T, S][] = [];

    for (const item1 of arr1) {
        for (const item2 of arr2) {
            result.push([item1, item2]);
        }
    }

    return result;
};

export default function HallOfFame() {
    const { lang } = useContext(LangContext);

    const dataYears = [
        ...new Set(nationalChampionshipData.map((elem) => elem.year))
            .union(new Set(onlineChampionshipData.map((elem) => elem.year)))
            .union(
                new Set(
                    rareTournamentNames
                        .map((name) =>
                            rareTournamentResults[name].map((result) =>
                                result.year.toString()
                            )
                        )
                        .reduce((a, b) => a.concat(b))
                )
            ),
    ].sort();

    const [minYear, setMinYear] = useState(dataYears[0]);
    const [maxYear, setMaxYear] = useState(dataYears[dataYears.length - 1]);
    const [order, setOrder] = useState<0 | 1 | -1 | null | undefined>(-1);
    const [field, setField] = useState<string>("nationalChampionship");

    const [tournamentsVisible, setTournamentsVisible] = useState(
        individualTournamentNames.map((name) => name === "nationalChampionship")
    );

    const playerNames = computePlayerNames();
    const tournamentStats =
        computeIndividualTournamentDataForPlayersBetweenYears(
            playerNames,
            minYear,
            maxYear
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
                />
                <Column
                    header={DICTIONARY.BGA_Username[lang]}
                    rowSpan={2}
                    field="BGA_Username"
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
            <h1>{DICTIONARY.hallOfFame[lang]}</h1>
            <NationalChampionshipNavigation />
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
                                                setTournamentsVisible([
                                                    ...tournamentsVisible.slice(
                                                        0,
                                                        i
                                                    ),
                                                    e.checked ?? false,
                                                    ...tournamentsVisible.slice(
                                                        i + 1
                                                    ),
                                                ])
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
                <Column field="Name" />
                <Column field="BGA_Username" body={BGALink} />
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
