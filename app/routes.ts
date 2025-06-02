import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export const ROUTE_HEADERS = {
  NATIONAL_CHAMPIONSHIP: "national-championship",
  HALL_OF_FAME: "hall-of-fame",
  PLAYERS: "players",
  ONLINE_CHAMPIONSHIP: "online-championship",
};

export default [
  index("routes/home.tsx"),
  ...prefix(ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP, [
    route("", "components/national-championship/year.tsx"),
    route(
      ROUTE_HEADERS.HALL_OF_FAME,
      "components/national-championship/hall-of-fame.tsx",
    ),
  ]),
] satisfies RouteConfig;
