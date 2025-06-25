import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TeamMemberData } from "./compute-player-data";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { medalColors } from "../hall-of-fame/compute-hall-of-fame-data";
import { teamContests } from "~/players/team-members";
import React, { useContext } from "react";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";

export default function TeamContests({
    teamMemberData,
}: {
    teamMemberData: TeamMemberData;
}) {
    const { lang } = useContext(LangContext);

    return (
        <>
            {teamMemberData.team_captain && (
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: "20px",
                        marginBottom: "12px",
                    }}
                >
                    <FontAwesomeIcon icon={faStar} color={medalColors.Gold} />
                    <span style={{ marginLeft: "0.5rem" }}>
                        {DICTIONARY.teamCaptainBGAUsername[lang]}
                    </span>
                </span>
            )}
            {teamMemberData.former_captain && (
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: "20px",
                        marginBottom: "10px",
                        lineHeight: "25px",
                    }}
                >
                    <FontAwesomeIcon icon={faStar} color={medalColors.Silver} />
                    <span style={{ marginLeft: "0.5rem" }}>
                        {DICTIONARY.formerTeamCaptainBGAUsername[lang]}
                    </span>
                </span>
            )}
            {teamContests.map((name) => {
                return teamMemberData[`${name}Participations`].length ? (
                    <span key={name}>
                        <span style={{ fontWeight: 600 }}>{name}</span>:{" "}
                        {teamMemberData[`${name}Participations`].join(", ")}
                    </span>
                ) : (
                    <React.Fragment key={name}></React.Fragment>
                );
            })}
        </>
    );
}
