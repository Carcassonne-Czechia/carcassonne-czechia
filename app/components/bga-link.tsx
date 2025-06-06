import { BGAStats } from "~/players/bga-stats";
import type { BGAUsername } from "~/players/team-members";

export default function BGALink(props: { BGA_Username: BGAUsername }) {
    const BASE_URL = "https://boardgamearena.com/player?id=";
    const id = BGAStats.find(
        (stat) => stat.bgaUsername === props["BGA_Username"]
    )?.id;

    return id ? (
        <a href={BASE_URL + id.toString()} target="blank">
            {props["BGA_Username"]}
        </a>
    ) : (
        <></>
    );
}
