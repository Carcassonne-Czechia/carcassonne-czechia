import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const ROUTE_HEADERS = {
    NATIONAL_CHAMPIONSHIP: "national-championship",
    HALL_OF_FAME: "hall-of-fame",
    PLAYERS: "players",
    ONLINE_CHAMPIONSHIP: "online-championship",
};

export default [
    index("routes/home.tsx"),
    route(`${ROUTE_HEADERS.PLAYERS}`, "components/players/players.tsx"),
    route(`${ROUTE_HEADERS.PLAYERS}/:player`, "components/players/player.tsx"),
    route(
        ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP,
        "components/national-championship/national-championship.tsx"
    ),
    route(
        ROUTE_HEADERS.ONLINE_CHAMPIONSHIP,
        "components/online-championship/online-championship.tsx"
    ),
    route(
        ROUTE_HEADERS.HALL_OF_FAME,
        "components/hall-of-fame/hall-of-fame.tsx"
    ),
] satisfies RouteConfig;
