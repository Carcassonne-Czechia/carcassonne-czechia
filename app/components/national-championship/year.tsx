import csv from "src/raw_data/offline_championships/all_data.csv";
import {
  nationalChampionshipHeaderRow,
  type NationalChampionshipResultsRow,
} from "~/typings/typings";
import { useState } from "react";
import NationalChampionshipAbout from "./about";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

export default function NationalChampionship() {
  const data = csv as NationalChampionshipResultsRow[];
  const dataYears = [...new Set(data.map((elem) => elem.Year))].sort();

  const [year, setYear] = useState<string>(dataYears[dataYears.length - 1]);

  return (
    <main>
      <NationalChampionshipAbout />
      <div className="flex justify-center">
        <Dropdown
          value={year}
          onChange={(e) => setYear(e.value)}
          options={[...new Set(data.map((row) => row.Year))]}
          optionLabel="name"
          placeholder="Select year"
          className="w-full md:w-14rem"
        />
        <DataTable
          value={data.slice(1).filter((row) => row.Year == year)}
          tableStyle={{ minWidth: "30rem" }}
        >
          {nationalChampionshipHeaderRow.map((field) => (
            <Column field={field} header={field} key={field}></Column>
          ))}
        </DataTable>
      </div>
    </main>
  );
}
