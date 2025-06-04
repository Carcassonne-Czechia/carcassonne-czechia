import { BGAStats } from "~/players/bga-stats";

export default function BGALink(props: { BGA_Username: string }) {
    const BASE_URL = "https://boardgamearena.com/player?id=";
    const id = BGAStats.find(
        (stat) => stat.bga_username === props["BGA_Username"]
    )?.id;

    return id ? (
        <a href={BASE_URL + id.toString()} target="blank">
            {props["BGA_Username"]}
        </a>
    ) : (
        <></>
    );
}
