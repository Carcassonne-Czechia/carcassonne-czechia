import { useContext, useState } from "react";
import { LangContext } from "~/i18n/lang-context";
import OnlineChampionshipAbout from "./online-about";
import OnlineChampionship2026 from "./years/2026";
import {
    onlineChampionshipHeaderRow,
    type OnlineChampionshipResultsRow,
} from "../national-championship/typings";
import { DataTable } from "primereact/datatable";
import { DICTIONARY } from "~/i18n/dictionary";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import BGALink from "../bga-link";
import { getSupabaseClient } from "~/lib/supabase-client";

type OnlineChampionshipRow = OnlineChampionshipResultsRow & {
    name: string;
};

type OnlineChampionshipLoaderData = {
    rows: OnlineChampionshipRow[];
    error: string | null;
};

type OnlineChampionshipDatabaseRow = {
    year: number;
    position: number;
    bga_username: string;
};

type PlayerNameRow = {
    name: string | null;
    bga_username: string | null;
};

export async function clientLoader(): Promise<OnlineChampionshipLoaderData> {
    const supabase = getSupabaseClient();
    const [championshipResult, playersResult] = await Promise.all([
        supabase
            .from("online_championship")
            .select("year,position,bga_username")
            .order("year")
            .order("position"),
        supabase
            .from("players")
            .select("name,bga_username")
            .not("bga_username", "is", null)
            .order("id"),
    ]);

    const queryError = championshipResult.error ?? playersResult.error;
    if (queryError) {
        return { rows: [], error: queryError.message };
    }

    const namesByUsername = new Map<string, string>();
    for (const player of (playersResult.data ??
        []) as unknown as PlayerNameRow[]) {
        if (
            player.name &&
            player.bga_username &&
            !namesByUsername.has(player.bga_username)
        ) {
            namesByUsername.set(player.bga_username, player.name);
        }
    }

    const rows = (
        (championshipResult.data ??
            []) as unknown as OnlineChampionshipDatabaseRow[]
    ).map(
        (row): OnlineChampionshipRow => ({
            year: String(row.year),
            position: String(row.position),
            name: namesByUsername.get(row.bga_username) ?? "",
            BGA_Username: row.bga_username,
        })
    );

    return { rows, error: null };
}

export default function OnlineChampionship({
    loaderData,
}: {
    loaderData?: OnlineChampionshipLoaderData;
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
                <OnlineChampionshipAbout />
                <p>{loadedData.error}</p>
            </main>
        );
    }

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <OnlineChampionshipAbout />
            <OnlineChampionship2026 />
            <iframe
                src="https://carcassonne.gg/CZ-2026-COC/"
                title={
                    lang === "en"
                        ? "Carcassonne Czechia online championship 2026"
                        : "Online mistrovství ČR v Carcassonne 2026"
                }
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                    width: "80%",
                    height: "min(1000px, 80vh)",
                    minHeight: "32rem",
                    border: "1px solid #ccc",
                    margin: "2rem 0 0 0",
                }}
            />
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
