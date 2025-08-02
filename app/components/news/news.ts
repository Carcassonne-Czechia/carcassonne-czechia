import type { Lang } from "~/i18n/lang-context";
import { ROUTE_HEADERS } from "~/routes";

export type NewsItem = {
    title: { [l in Lang]: string };
    date: Date;
    content: { [l in Lang]: string };
    imageSource?: string;
    linkTo?: string;
};

export const NEWS: Array<NewsItem> = [
    {
        linkTo: ROUTE_HEADERS.ONLINE_CHAMPIONSHIP,
        imageSource: "/assets/news/2025-online-championship.jpg",
        title: {
            cs: "Online mistrovství České republiky 2025",
            en: "Online championship of the Czech Republic 2025",
        },
        date: new Date("2025-08-02"),
        content: {
            cs: "Připravujeme online mistrovství České republiky v roce 2025. Začínáme už v září a pokud si chcete zahrát, neváhejte se přihlásit. Vítězové budou reprezentovat Česko v Carcassonne Champions League.",
            en: "We are preparing the Online Championship of the Czech Republic in 2025. Starting in September, the winners will represent Czechia in the Carcassonne Champions League.",
        },
    },
];
