import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Carcassonne Czechia" },
        {
            name: "description",
            content: "Czech national team in Carcassonne webiste",
        },
    ];
}

export default function Home() {
    return <></>;
}
