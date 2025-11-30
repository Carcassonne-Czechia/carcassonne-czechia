import onlineChampionshipData from "src/raw-data/online-championships/all_data.csv";
import { useContext, useState } from "react";
import { LangContext } from "~/i18n/lang-context";
import OnlineChampionshipAbout from "./online-about";
import { onlineChampionshipHeaderRow } from "../national-championship/typings";
import { DataTable } from "primereact/datatable";
import { DICTIONARY } from "~/i18n/dictionary";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import BGALink from "../bga-link";
import { getNameFromBGAUsername } from "~/utils";

export default function OnlineChampionship() {
    const { lang } = useContext(LangContext);
    const dataYears = [
        ...new Set(onlineChampionshipData.map((elem) => elem.year)),
    ].sort();
    const [year, setYear] = useState<string>(dataYears[dataYears.length - 1]);

    const dataWithNames = onlineChampionshipData.map((row) => {
        return {
            ...row,
            name: getNameFromBGAUsername(row.BGA_Username) ?? "",
        };
    });

    return (
        <main>
            <OnlineChampionshipAbout />
            <h2 style={{ textAlign: "center" }}>
                {DICTIONARY.historicalResults[lang]}
            </h2>
            <div style={{ padding: "0 0.5rem" }}>
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
                                onlineChampionshipData.map((row) => row.year)
                            ),
                        ]}
                        optionLabel="year"
                        placeholder={DICTIONARY.selectYear[lang]}
                    />
                </div>
                <DataTable
                    value={dataWithNames.filter((row) => row.year === year)}
                    tableStyle={{ minWidth: "30rem", marginTop: "1rem" }}
                    stripedRows
                    showGridlines
                >
                    {onlineChampionshipHeaderRow.map((field) => (
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
