import { currentTeamMemberBGAUsernames } from "~/players/team-members";
import {
    computeTeamMemberDataFromBGAUsername,
    type TeamMemberData,
} from "./compute-player-data";
import { DataView } from "primereact/dataview";
import { Link } from "react-router";
import PlayerAvatar from "./player_avatar";
import TeamContests from "./team-contest-display";

export default function Players() {
    const currentTeamMemberData = currentTeamMemberBGAUsernames.map(
        (BGA_Username) => computeTeamMemberDataFromBGAUsername(BGA_Username)
    );

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
            <h1>Team members</h1>
            <div className="card">
                <DataView
                    value={currentTeamMemberData}
                    listTemplate={listTemplate}
                    layout={"grid"}
                />
            </div>
        </main>
    );
}
