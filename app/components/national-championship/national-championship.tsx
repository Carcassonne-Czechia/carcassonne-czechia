import nationalChampionshipData from "src/raw-data/offline-championships/all_data.csv";
import {
    nationalChampionshipHeaderRow,
    type NationalChampionshipResultsRow,
    type NationalChampionshipResultsRowWithUsername,
} from "~/components/national-championship/typings";
import { useContext, useState } from "react";
import NationalChampionshipAbout from "./national-about";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import BGALink from "../bga-link";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { getBGAUsernameFromName } from "~/utils";

export const computeDataWithBGAUsernames = (
    data: NationalChampionshipResultsRow[]
) => {
    return data.map((row) => {
        return {
            BGA_Username: getBGAUsernameFromName(row.name) ?? "",
            ...row,
        };
    });
};

export default function NationalChampionship() {
    const { lang } = useContext(LangContext);
    const dataYears = [
        ...new Set(nationalChampionshipData.map((elem) => elem.year)),
    ].sort();
    const [year, setYear] = useState<string>(dataYears[dataYears.length - 1]);

    const dataWithBGAUsernames: NationalChampionshipResultsRowWithUsername[] =
        computeDataWithBGAUsernames(nationalChampionshipData);

    return (
        <main>
            <NationalChampionshipAbout />
            <div>
                <div>
                    <label
                        htmlFor="national-year-picker"
                        style={{ marginRight: "0.5rem", fontWeight: "600" }}
                    >
                        {DICTIONARY.selectYear[lang]}:
                    </label>
                    <Dropdown
                        value={year}
                        id="national-year-picker"
                        name="national-year-picker"
                        onChange={(e) => setYear(e.value)}
                        options={[
                            ...new Set(
                                nationalChampionshipData.map((row) => row.year)
                            ),
                        ]}
                        optionLabel="year"
                        placeholder={DICTIONARY.selectYear[lang]}
                    />
                </div>
                <DataTable
                    value={dataWithBGAUsernames.filter(
                        (row) => row.year === year
                    )}
                    tableStyle={{ minWidth: "30rem", marginTop: "1rem" }}
                    stripedRows
                    showGridlines
                    scrollable
                    scrollHeight="500px"
                >
                    {nationalChampionshipHeaderRow.map((field) => (
                        <Column
                            field={field}
                            header={DICTIONARY[field][lang]}
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
