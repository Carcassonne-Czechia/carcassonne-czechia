import type { TeamMemberData } from "./compute-player-data";
import { DataView } from "primereact/dataview";
import { Link } from "react-router";
import PlayerAvatar from "./player-avatar";
import TeamContests from "./team-contest-display";
import { DICTIONARY } from "~/i18n/dictionary";
import { useContext, useEffect, useState } from "react";
import { LangContext } from "~/i18n/lang-context";
import { getSupabaseClient } from "~/lib/supabase-client";
import type { CurrentTeamMemberBGAUsername } from "~/players/team-members";

type PlayerRow = {
    name: string | null;
    bga_username: string;
    team_captain: boolean;
    former_captain: boolean;
    team_participations: {
        team_contest_name: string;
        year: number;
    }[];
};

function teamMemberPriority(player: TeamMemberData) {
    if (player.team_captain) return 0;
    if (player.former_captain) return 1;
    return 2;
}

function totalParticipations(player: TeamMemberData) {
    return (
        player.WTCOCParticipations.length + player.ETCOCParticipations.length
    );
}

export default function Players() {
    const { lang } = useContext(LangContext);
    const [currentTeamMemberData, setCurrentTeamMemberData] = useState<
        TeamMemberData[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadPlayers = async () => {
            const { data, error: playersError } = await getSupabaseClient()
                .from("players")
                .select(
                    "name,bga_username,team_captain,former_captain,team_participations(team_contest_name,year)"
                )
                .eq("national_team_membership_current", true)
                .not("bga_username", "is", null)
                .order("bga_username");

            if (!active) return;

            if (playersError) {
                setError(playersError.message);
                setLoading(false);
                return;
            }

            const players = (data ?? []) as unknown as PlayerRow[];
            const teamMembers = players.map((player) => ({
                name: player.name ?? undefined,
                BGA_Username:
                    player.bga_username as CurrentTeamMemberBGAUsername,
                team_captain: player.team_captain,
                former_captain: player.former_captain,
                WTCOCParticipations: player.team_participations
                    .filter(
                        (participation) =>
                            participation.team_contest_name === "WTCOC"
                    )
                    .map((participation) => participation.year),
                ETCOCParticipations: player.team_participations
                    .filter(
                        (participation) =>
                            participation.team_contest_name === "ETCOC"
                    )
                    .map((participation) => participation.year),
            }));

            teamMembers.sort((playerA, playerB) => {
                const priorityDifference =
                    teamMemberPriority(playerA) - teamMemberPriority(playerB);
                if (priorityDifference !== 0) return priorityDifference;

                const participationDifference =
                    totalParticipations(playerB) - totalParticipations(playerA);
                if (participationDifference !== 0)
                    return participationDifference;

                return playerA.BGA_Username.localeCompare(playerB.BGA_Username);
            });

            setCurrentTeamMemberData(teamMembers);
            setLoading(false);
        };

        void loadPlayers();
        return () => {
            active = false;
        };
    }, []);

    const itemTemplate = (item: TeamMemberData) => {
        return (
            <div
                className="players-item-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "184px",
                    justifyContent: "start",
                    margin: "2rem 4rem",
                    lineHeight: "1.5rem",
                }}
                key={item.BGA_Username}
            >
                <PlayerAvatar BGA_Username={item.BGA_Username} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Link
                        style={{
                            fontWeight: 600,
                            marginBottom: "20px",
                            fontSize: "20px",
                            textAlign: "center",
                        }}
                        to={`/players/${item.BGA_Username}`}
                    >
                        {item.BGA_Username}
                    </Link>
                    {item.name ? (
                        <span
                            style={{
                                fontSize: "20px",
                                textAlign: "center",
                                marginBottom: "20px",
                                fontWeight: 600,
                            }}
                        >
                            {item.name}
                        </span>
                    ) : (
                        <></>
                    )}
                    <TeamContests teamMemberData={item} />
                </div>
            </div>
        );
    };

    const listTemplate = (items: TeamMemberData[]) => {
        if (!items || items.length === 0) return null;

        const list = items.map((product) => {
            return itemTemplate(product);
        });

        return (
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}
            >
                {list}
            </div>
        );
    };

    return (
        <main>
            <h1 className="bg-aquamarine">{DICTIONARY.members[lang]}</h1>
            <div className="card">
                {loading ? (
                    <p>Loading players...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <DataView
                        value={currentTeamMemberData}
                        listTemplate={listTemplate}
                        layout={"grid"}
                    />
                )}
            </div>
        </main>
    );
}
