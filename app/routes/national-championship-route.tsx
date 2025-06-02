import NationalChampionship from "~/components/national-championship/year";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ name: "description", content: "Czechia national championship" }];
}

export default function NationalChampionshipRoute() {
  return <NationalChampionship />;
}
