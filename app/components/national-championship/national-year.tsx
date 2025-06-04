import nationalChampionshipData from "src/raw_data/offline-championships/all_data.csv";
import {
    nationalChampionshipHeaderRow,
    type NationalChampionshipResultsRow,
    type NationalChampionshipResultsRowWithUsername,
} from "~/components/national-championship/typings";
import { useState } from "react";
import NationalChampionshipAbout from "./national-about";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { BGAStats } from "~/players/bga-stats";
import BGALink from "../bga-link";

export const computeDataWithBGAUsernames = (
    data: NationalChampionshipResultsRow[]
) => {
    return data.map((row) => {
        return {
            BGA_Username:
                BGAStats.find((stat) => stat.name === row.Name)?.bga_username ??
                "",
            ...row,
        };
    });
};

export default function NationalChampionship() {
    const dataYears = [
        ...new Set(nationalChampionshipData.map((elem) => elem.Year)),
    ].sort();
    const [year, setYear] = useState<string>(dataYears[dataYears.length - 1]);

    const dataWithBGAUsernames: NationalChampionshipResultsRowWithUsername[] =
        computeDataWithBGAUsernames(nationalChampionshipData);

    return (
        <main>
            <NationalChampionshipAbout />
            <div>
                <Dropdown
                    value={year}
                    onChange={(e) => setYear(e.value)}
                    options={[
                        ...new Set(
                            nationalChampionshipData.map((row) => row.Year)
                        ),
                    ]}
                    optionLabel="name"
                    placeholder="Select year"
                    className="w-full md:w-14rem"
                />
                <DataTable
                    value={dataWithBGAUsernames
                        .slice(1)
                        .filter((row) => row.Year === year)}
                    tableStyle={{ minWidth: "30rem", marginTop: "1rem" }}
                    stripedRows
                    showGridlines
                >
                    {nationalChampionshipHeaderRow.map((field) => (
                        <Column
                            field={field}
                            header={field}
                            key={field}
                            body={
                                field === "BGA_Username" ? BGALink : undefined
                            }
                        ></Column>
                    ))}
                </DataTable>
            </div>
        </main>
    );
}
