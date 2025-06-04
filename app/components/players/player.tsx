import {
    type CurrentTeamMemberBGAUsername,
    type FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import { computeTeamMemberDataFromBGAUsername } from "./compute-player-data";
import PlayerAvatar from "./player_avatar";
import TeamContests from "./team-contest-display";
import { individualTournamentNames } from "~/players/tournament-results";
import { computeIndividualTournamentDataForPlayersBetweenYears } from "../national-championship/compute-hall-of-fame-data";
import SignificantIndividualResults from "./significant-individual-results";

export default function Player({
    params,
}: {
    params: {
        player: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    };
}) {
    const BGA_Username = params.player;
    const teamMemberData = computeTeamMemberDataFromBGAUsername(BGA_Username);
    const name = teamMemberData.name;
    const individualTournamentData = name
        ? computeIndividualTournamentDataForPlayersBetweenYears(
              [name],
              Number.NEGATIVE_INFINITY,
              Number.POSITIVE_INFINITY
          )[0]
        : undefined;
    console.log(individualTournamentData);

    return (
        <main style={{ paddingTop: "2rem" }}>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <PlayerAvatar BGA_Username={BGA_Username} />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                    }}
                >
                    <h2
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: "#455230",
                        }}
                    >
                        {BGA_Username}
                    </h2>
                    <TeamContests teamMemberData={teamMemberData} />
                    {individualTournamentData &&
                        individualTournamentNames.map((name) => (
                            <SignificantIndividualResults
                                tournamentName={name}
                                results={
                                    individualTournamentData[`${name}RawData`]
                                }
                            />
                        ))}
                </div>
            </div>
        </main>
    );
}
