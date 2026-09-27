import { BGAStats } from "~/players/bga-stats";
import type { BGAUsername } from "~/players/team-members";

export default function BGALink(props: {
    BGA_Username: BGAUsername | string;
    BGA_ID?: number | null;
}) {
    const BASE_URL = "https://boardgamearena.com/player?id=";
    const id =
        props.BGA_ID ??
        BGAStats.find((stat) => stat.bgaUsername === props.BGA_Username)?.id;

    return id ? (
        <a href={BASE_URL + id.toString()} target="_blank" rel="noreferrer">
            {props["BGA_Username"]}
        </a>
    ) : (
        <>{props["BGA_Username"]}</>
    );
}
