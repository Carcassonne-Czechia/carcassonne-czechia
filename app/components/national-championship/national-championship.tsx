import {
    nationalChampionshipHeaderRow,
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
import { getSupabaseClient } from "~/lib/supabase-client";

type NationalChampionshipRow = {
    year: number;
    position: number;
    name: string;
    points: number;
    score_difference: number;
};

type PlayerNameRow = {
    name: string | null;
    bga_username: string | null;
};

type NationalChampionshipLoaderData = {
    rows: NationalChampionshipResultsRowWithUsername[];
    error: string | null;
};

export async function clientLoader(): Promise<NationalChampionshipLoaderData> {
    const supabase = getSupabaseClient();
    const [
        { data: championshipData, error: championshipError },
        { data: playerData, error: playerError },
    ] = await Promise.all([
        supabase
            .from("national_championship")
            .select("year,position,name,points,score_difference")
            .order("year")
            .order("position"),
        supabase
            .from("players")
            .select("name,bga_username")
            .not("name", "is", null)
            .not("bga_username", "is", null)
            .order("id"),
    ]);

    const queryError = championshipError ?? playerError;
    if (queryError) {
        return { rows: [], error: queryError.message };
    }

    const usernamesByName = new Map<string, string>();
    for (const player of (playerData ?? []) as unknown as PlayerNameRow[]) {
        if (
            player.name &&
            player.bga_username &&
            !usernamesByName.has(player.name)
        ) {
            usernamesByName.set(player.name, player.bga_username);
        }
    }

    const rows = (
        (championshipData ?? []) as unknown as NationalChampionshipRow[]
    ).map(
        (row): NationalChampionshipResultsRowWithUsername => ({
            BGA_Username: usernamesByName.get(row.name) ?? "",
            year: String(row.year),
            position: String(row.position),
            name: row.name,
            points: String(row.points),
            scoreDifference: String(row.score_difference),
        })
    );

    return { rows, error: null };
}

export default function NationalChampionship({
    loaderData,
}: {
    loaderData?: NationalChampionshipLoaderData;
}) {
    const { lang } = useContext(LangContext);
    const loadedData = loaderData ?? { rows: [], error: null };
    const dataYears = [
        ...new Set(loadedData.rows.map((row) => row.year)),
    ].sort();
    const [year, setYear] = useState<string>(
        dataYears[dataYears.length - 1] ?? ""
    );

    if (loadedData.error) {
        return (
            <main>
                <NationalChampionshipAbout />
                <p>{loadedData.error}</p>
            </main>
        );
    }

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
                        options={dataYears}
                        optionLabel="year"
                        placeholder={DICTIONARY.selectYear[lang]}
                    />
                </div>
                <DataTable
                    value={loadedData.rows.filter((row) => row.year === year)}
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
