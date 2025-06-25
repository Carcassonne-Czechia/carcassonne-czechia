import { HomePage } from "~/components/homepage/homepage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Carcassonne Czechia" },
        {
            name: "description",
            content: "Czech national team in Carcassonne website",
        },
    ];
}

export default function Home() {
    return <HomePage />;
}
