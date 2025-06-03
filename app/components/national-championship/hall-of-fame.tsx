import nationalChampionshipData from "src/raw_data/offline-championships/all_data.csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagCheckered, faMedal } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column, type ColumnSortEvent } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import {
    getShortTournamentName,
    placements,
    type TournamentName,
    tournamentNames,
} from "~/players/tournament-results";
import BGALink from "../bga-link";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import {
    computeTournamentStatsForAllPlayersBetweenYears,
    filterTournamentStatsRows,
    sortTournamentStats,
} from "./compute-hall-of-fame-data";
import { Checkbox } from "primereact/checkbox";

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
    const dataYears = [
        ...new Set(nationalChampionshipData.map((elem) => elem.Year)),
    ].sort();
    const [minYear, setMinYear] = useState(dataYears[0]);
    const [maxYear, setMaxYear] = useState(dataYears[dataYears.length - 1]);
    const [order, setOrder] = useState<0 | 1 | -1 | null | undefined>(-1);
    const [field, setField] = useState<string>("nationalChampionship");

    const [tournamentsVisible, setTournamentsVisible] = useState(
        tournamentNames.map((name) => name == "nationalChampionship")
    );

    const medalColors = {
        Gold: "#FEE101",
        Silver: "#D7D7D7",
        Bronze: "#824A02",
    } as const;

    const tournamentStats = computeTournamentStatsForAllPlayersBetweenYears(
        minYear,
        maxYear,
        tournamentsVisible
    );
    const filteredTournamentStats = filterTournamentStatsRows(tournamentStats);
    const initialSortedTournamentNames = sortTournamentStats(
        filteredTournamentStats,
        "nationalChampionship",
        -1
    );

    const tournamentColumnNames = cartesianProduct(tournamentNames, placements);

    const sortColumn = (e: ColumnSortEvent, tournamentName: TournamentName) => {
        const tournamentStatsCopy = [...filteredTournamentStats];
        return sortTournamentStats(
            tournamentStatsCopy,
            tournamentName,
            e.order == 1 ? 1 : -1
        );
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Name" rowSpan={2} field="Name" />
                <Column header="BGA" rowSpan={2} field="BGA_Username" />
                {tournamentNames
                    .filter((_, i) => tournamentsVisible[i])
                    .map((tournamentName) => (
                        <Column
                            header={tournamentName}
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
                                        placement == "Participation"
                                            ? faFlagCheckered
                                            : faMedal
                                    }
                                    style={
                                        placement != "Participation"
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
            <h1>Hall of Fame</h1>
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
                        <span>Min year:</span>
                    </span>
                    <Dropdown
                        value={minYear}
                        onChange={(e) => setMinYear(e.value)}
                        options={[
                            ...new Set(
                                nationalChampionshipData.map((row) => row.Year)
                            ),
                        ]}
                        optionLabel="name"
                        placeholder="Select start year"
                        className="w-full md:w-14rem"
                        style={{ marginRight: "1rem", marginLeft: "0.5rem" }}
                    />
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                        }}
                    >
                        <span>Max year:</span>
                    </span>
                    <Dropdown
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.value)}
                        options={[
                            ...new Set(
                                nationalChampionshipData.map((row) => row.Year)
                            ),
                        ]}
                        optionLabel="name"
                        placeholder="Select start year"
                        className="w-full md:w-14rem"
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
                            Include competitions:
                        </span>
                    </span>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {tournamentNames.map((name, i) => {
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
                                            {getShortTournamentName(name)}:
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
                value={initialSortedTournamentNames}
                headerColumnGroup={headerGroup}
                stripedRows
                showGridlines
                scrollable
                scrollHeight="400px"
                sortOrder={order}
                sortField={field}
                onSort={(e) => {
                    setOrder(e.sortOrder);
                    setField(e.sortField);
                }}
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
