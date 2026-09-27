import {
    type BGAUsername,
    type CurrentTeamMemberBGAUsername,
    type FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import type { TeamMemberData } from "./compute-player-data";
import PlayerAvatar from "./player-avatar";
import TeamContests from "./team-contest-display";
import {
    individualTournamentNames,
    type IndividualTournamentName,
    type IndividualTournamentResult,
    type Rank,
} from "~/players/tournament-results";
import SignificantIndividualResults from "./significant-individual-results";
import Markdown from "react-markdown";
import { useContext, useState } from "react";
import { LangContext, type Lang } from "~/i18n/lang-context";
import { SelectButton } from "primereact/selectbutton";
import { DICTIONARY } from "~/i18n/dictionary";
import { getSupabaseClient } from "~/lib/supabase-client";

type PlayerLoaderData = {
    bios: Partial<Record<BGAUsername, Record<Lang, string>>>;
    teamMemberData: TeamMemberData | null;
    tournamentResults: Record<
        IndividualTournamentName,
        IndividualTournamentResult[]
    >;
    error: string | null;
};

type PlayerRow = {
    id: number;
    name: string | null;
    bga_username: string;
    team_captain: boolean;
    former_captain: boolean;
};

type TeamParticipationRow = {
    team_contest_name: string;
    year: number;
};

type TournamentResultRow = {
    tournament_name: string;
    year: number;
    rank: string;
};

type NationalChampionshipRow = {
    year: number;
    position: number;
};

type OnlineChampionshipRow = {
    year: number;
    position: number;
};

const emptyTournamentResults = () =>
    Object.fromEntries(
        individualTournamentNames.map((name) => [name, []])
    ) as unknown as Record<
        IndividualTournamentName,
        IndividualTournamentResult[]
    >;

const parseRank = (rank: string): Rank =>
    /^\d+$/.test(rank) ? Number(rank) : (rank as Rank);

export async function clientLoader({
    params,
}: {
    params: { player?: string };
}): Promise<PlayerLoaderData> {
    const bios = await fetch("/all-bios.json").then((res) => res.json());
    const bgaUsername = params.player;
    const tournamentResults = emptyTournamentResults();

    if (!bgaUsername) {
        return {
            bios,
            teamMemberData: null,
            tournamentResults,
            error: "Player not found.",
        };
    }

    const supabase = getSupabaseClient();
    const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("id,name,bga_username,team_captain,former_captain")
        .eq("bga_username", bgaUsername)
        .maybeSingle();

    if (playerError || !playerData) {
        return {
            bios,
            teamMemberData: null,
            tournamentResults,
            error: playerError?.message ?? "Player not found.",
        };
    }

    const player = playerData as unknown as PlayerRow;
    const [teamResult, tournamentResult, nationalResult, onlineResult] =
        await Promise.all([
            supabase
                .from("team_participations")
                .select("team_contest_name,year")
                .eq("player_id", player.id)
                .order("year"),
            supabase
                .from("tournament_results")
                .select("tournament_name,year,rank")
                .eq("player_id", player.id)
                .order("year"),
            player.name
                ? supabase
                      .from("national_championship")
                      .select("year,position")
                      .eq("name", player.name)
                      .order("year")
                : Promise.resolve({ data: [], error: null }),
            supabase
                .from("online_championship")
                .select("year,position")
                .eq("bga_username", bgaUsername)
                .order("year"),
        ]);

    const queryError = [
        teamResult.error,
        tournamentResult.error,
        nationalResult.error,
        onlineResult.error,
    ].find(Boolean);

    if (queryError) {
        return {
            bios,
            teamMemberData: null,
            tournamentResults,
            error: queryError.message,
        };
    }

    const teamParticipations = (teamResult.data ??
        []) as unknown as TeamParticipationRow[];
    const teamMemberData: TeamMemberData = {
        name: player.name ?? undefined,
        BGA_Username: bgaUsername as
            | CurrentTeamMemberBGAUsername
            | FormerTeamMemberBGAUsername,
        team_captain: player.team_captain,
        former_captain: player.former_captain,
        WTCOCParticipations: teamParticipations
            .filter(
                (participation) => participation.team_contest_name === "WTCOC"
            )
            .map((participation) => participation.year),
        ETCOCParticipations: teamParticipations
            .filter(
                (participation) => participation.team_contest_name === "ETCOC"
            )
            .map((participation) => participation.year),
    };

    for (const result of (tournamentResult.data ??
        []) as unknown as TournamentResultRow[]) {
        if (result.tournament_name in tournamentResults) {
            tournamentResults[
                result.tournament_name as IndividualTournamentName
            ].push({ year: result.year, rank: parseRank(result.rank) });
        }
    }

    for (const result of (nationalResult.data ??
        []) as unknown as NationalChampionshipRow[]) {
        tournamentResults.nationalChampionship.push({
            year: result.year,
            rank: result.position,
        });
    }

    for (const result of (onlineResult.data ??
        []) as unknown as OnlineChampionshipRow[]) {
        tournamentResults.onlineChampionship.push({
            year: result.year,
            rank: result.position,
        });
    }

    return { bios, teamMemberData, tournamentResults, error: null };
}

type Page = "achievements" | "bio";

export default function Player({
    params,
    loaderData,
}: {
    params: {
        player: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    };
    loaderData: PlayerLoaderData;
}) {
    const { lang } = useContext(LangContext);
    const [page, setPage] = useState<Page>("achievements");

    const BGA_Username = params.player;

    if (loaderData.error || !loaderData.teamMemberData) {
        return (
            <main>
                <p>{loaderData.error ?? "Player not found."}</p>
            </main>
        );
    }

    const teamMemberData = loaderData.teamMemberData;
    const name = teamMemberData.name;

    const itemTemplate = (page: Page) => {
        return <>{DICTIONARY[page][lang]}</>;
    };

    return (
        <main style={{ paddingTop: "2rem" }}>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "min(250px, max(30%, 184px))",
                    }}
                >
                    <PlayerAvatar BGA_Username={BGA_Username} />
                </div>
                <div style={{ width: "max(350px, 50%)", margin: "2rem" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{
                                color: "#455230",
                            }}
                        >
                            {BGA_Username}
                        </h2>
                        <span
                            style={{
                                fontSize: "20px",
                                marginBottom: "20px",
                                fontWeight: 600,
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            {name}
                        </span>
                        <SelectButton
                            value={page}
                            onChange={(e) => setPage(e.value)}
                            options={["achievements", "bio"]}
                            itemTemplate={itemTemplate}
                            style={{ marginBottom: "1rem" }}
                        />
                    </div>
                    {page === "achievements" ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "start",
                                flexDirection: "column",
                            }}
                        >
                            <TeamContests teamMemberData={teamMemberData} />
                            {individualTournamentNames.map((tournamentName) => (
                                <SignificantIndividualResults
                                    tournamentName={tournamentName}
                                    results={
                                        loaderData.tournamentResults[
                                            tournamentName
                                        ]
                                    }
                                    key={tournamentName}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "start",
                            }}
                            className="long-text"
                        >
                            <Markdown>
                                {loaderData.bios?.[BGA_Username]?.[lang]}
                            </Markdown>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
