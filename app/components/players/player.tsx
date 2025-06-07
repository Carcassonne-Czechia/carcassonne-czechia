import {
    type BGAUsername,
    type CurrentTeamMemberBGAUsername,
    type FormerTeamMemberBGAUsername,
} from "~/players/team-members";
import { computeTeamMemberDataFromBGAUsername } from "./compute-player-data";
import PlayerAvatar from "./player-avatar";
import TeamContests from "./team-contest-display";
import { individualTournamentNames } from "~/players/tournament-results";
import { computeIndividualTournamentDataForPlayersBetweenYears } from "../hall-of-fame/compute-hall-of-fame-data";
import SignificantIndividualResults from "./significant-individual-results";
import Markdown from "react-markdown";
import { useContext, useState } from "react";
import { LangContext, type Lang } from "~/i18n/lang-context";
import { SelectButton } from "primereact/selectbutton";
import { DICTIONARY } from "~/i18n/dictionary";

export async function clientLoader() {
    const json = await fetch("/all-bios.json").then((res) => res.json());
    return json;
}

type Page = "achievements" | "bio";

export default function Player({
    params,
    loaderData,
}: {
    params: {
        player: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    };
    loaderData: Partial<Record<BGAUsername, Record<Lang, string>>>;
}) {
    const { lang } = useContext(LangContext);
    const [page, setPage] = useState<Page>("achievements");

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
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
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
                            {individualTournamentData &&
                                individualTournamentNames.map((name) => (
                                    <SignificantIndividualResults
                                        tournamentName={name}
                                        results={
                                            individualTournamentData[
                                                `${name}RawData`
                                            ]
                                        }
                                        key={name}
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
                                {loaderData?.[BGA_Username]?.[lang]}
                            </Markdown>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
