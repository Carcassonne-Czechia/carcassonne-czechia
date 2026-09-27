import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const ROUTE_HEADERS = {
    NATIONAL_CHAMPIONSHIP: "national-championship",
    HALL_OF_FAME: "hall-of-fame",
    PLAYERS: "players",
    ONLINE_CHAMPIONSHIP: "online-championship",
    LINKS: "links",
    LOGIN: "login",
    REGISTER: "register/:token",
    ADMIN: "admin",
    EDITOR: "editor",
    PROFILE: "profile",
    NEWS: "news",
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
        `${ROUTE_HEADERS.ONLINE_CHAMPIONSHIP}/draw`,
        "components/online-championship/draw-page.tsx"
    ),
    route(
        ROUTE_HEADERS.HALL_OF_FAME,
        "components/hall-of-fame/hall-of-fame.tsx"
    ),
    route(ROUTE_HEADERS.LINKS, "components/links/links.tsx"),
    route(ROUTE_HEADERS.LOGIN, "routes/login.tsx"),
    route(ROUTE_HEADERS.REGISTER, "routes/register.tsx"),
    route(ROUTE_HEADERS.ADMIN, "routes/admin.tsx"),
    route(ROUTE_HEADERS.EDITOR, "routes/editor.tsx"),
    route(ROUTE_HEADERS.PROFILE, "routes/profile.tsx"),
    route(`${ROUTE_HEADERS.NEWS}/new`, "routes/news-new.tsx"),
    route(`${ROUTE_HEADERS.NEWS}/:id/edit`, "routes/news-edit.tsx"),
] satisfies RouteConfig;
