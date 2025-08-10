import { BGAStats } from "../app/players/bga-stats.ts";
import { rareTournamentResults } from "../app/players/tournament-results.ts";
import { writeFile } from "fs/promises";

const BGAStatsJSON = JSON.stringify(BGAStats);
const rareTournamentResultsJSON = JSON.stringify(rareTournamentResults);

const CI = process.env.CI;
const base_dir = CI === "true" ? "" : "../";

await writeFile(
    base_dir + "src/raw-data/bga-stats.json",
    BGAStatsJSON,
    "utf-8"
);
await writeFile(
    base_dir + "src/raw-data/rare-tournament-results.json",
    rareTournamentResultsJSON,
    "utf-8"
);
