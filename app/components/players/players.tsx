import {
    currentTeamMemberBGAUsernames,
    teamContests,
} from "~/players/team-members";
import {
    computeTeamMemberDataFromBGAUsername,
    type TeamMemberData,
} from "./compute-player-data";
import { DataView } from "primereact/dataview";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { medalColors } from "../national-championship/compute-hall-of-fame-data";
import PlayerAvatar from "./player_avatar";

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
            >
                <PlayerAvatar BGA_Username={item.BGA_Username} />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "20px",
                    }}
                >
                    <Link
                        style={{ fontWeight: 600, marginBottom: "20px" }}
                        to={`/players/${item.BGA_Username}`}
                    >
                        {item.BGA_Username}
                    </Link>
                </div>
                {item.team_captain && (
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: "20px",
                            marginBottom: "12px",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            color={medalColors.Gold}
                        />
                        <span style={{ marginLeft: "0.5rem" }}>
                            Team captain
                        </span>
                    </span>
                )}
                {item.former_captain && (
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: "20px",
                            marginBottom: "10px",
                            lineHeight: "25px",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            color={medalColors.Silver}
                        />
                        <span style={{ marginLeft: "0.5rem" }}>
                            Former team captain
                        </span>
                    </span>
                )}
                {teamContests.map((name) => {
                    return item[`${name}Participations`].length ? (
                        <span key={name}>
                            <span style={{ fontWeight: 600 }}>{name}</span>:{" "}
                            {item[`${name}Participations`].join(", ")}
                        </span>
                    ) : (
                        <></>
                    );
                })}
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
