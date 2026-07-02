import type { JSX } from "react";
import type { Lang } from "~/i18n/lang-context";
import { ROUTE_HEADERS } from "~/routes";
import BGALink from "../bga-link";
import { Link } from "react-router";

export type NewsItem = {
    title: { [l in Lang]: string };
    date: Date;
    content: { [l in Lang]: string | JSX.Element };
    imageSource?: string;
    linkTo?: string;
};

export const NEWS: Array<NewsItem> = [
    {
        linkTo: ROUTE_HEADERS.ONLINE_CHAMPIONSHIP,
        imageSource: "/assets/news/2025-online-championship.jpg",
        title: {
            cs: "Online mistrovství České republiky 2026",
            en: "Online championship of the Czech Republic 2026",
        },
        date: new Date("2026-07-02"),
        content: {
            cs: (
                <p>
                    Připravujeme pro vás další ročník online mistrovství České
                    republiky v Carcassonne. Začínáme už 31. srpna 2026 a těšíme
                    se na vaši účast! Vítězové se opět kvalifikují do
                    Carcassonne Champions League. Podrobnosti naleznete na{" "}
                    <Link to="/online-championship">
                        stránce online mistrovství
                    </Link>
                    .
                </p>
            ),
            en: (
                <p>
                    We are preparing the next edition of the online championship
                    of the Czech Republic in Carcassonne. It starts on August
                    31, 2026 and the winners will again qualify for the
                    Carcassonne Champions League. Details can be found on the{" "}
                    <Link to="/online-championship">
                        online championship page
                    </Link>
                    .
                </p>
            ),
        },
    },
    {
        title: {
            en: "Engaging fall for our community",
            cs: "Podzim plný turnajů pro naši komunitu",
        },
        imageSource: "/assets/news/fall.png",
        date: new Date("2025-11-30"),
        content: {
            en: (
                <>
                    <p>
                        In addition to the national and online championships,
                        our team took part in the European Championships. The
                        group stage already showed the competitiveness and
                        evenness of the field, with our players delivering solid
                        performances resulting in three 3:2 victories placing us
                        at the second place in our group. We congratulate Poland
                        for winning our group with exceptional performances and
                        give props to the rest of the teams we played against.
                    </p>
                    <p>
                        We would like to share a memorable moment of{" "}
                        <BGALink BGA_Username="J0nny" /> drawing a connection
                        tile at the last turn in his decider game against
                        Croatia that turned the game around making him win by
                        two points and our team win the match 3:2.
                    </p>
                    <p>
                        In the quarterfinals, we faced a strong Belgian team and
                        sadly only managed to snatch two duels. Overall, we are
                        proud of our team's performance and look forward to
                        future competitions. Even though we were again a couple
                        of decisions away from a breakthrough, we are motivated
                        to keep improving and aiming for a medal in the future.
                    </p>
                    <p>
                        In addition to that, <BGALink BGA_Username="chonps" />{" "}
                        managed to claim a very respectable 10th place in the
                        in-person World Championships. This was the first time
                        the field has grown to over 50 players, making this
                        achievement even more impressive. Congratulations to
                        chonps for representing our community on the world
                        stage!
                    </p>
                </>
            ),
            cs: (
                <>
                    <p>
                        Kromě mistrovství České republiky a online mistrovství
                        se náš tým zúčastnil také Mistrovství Evropy. Skupinová
                        fáze již ukázala vyrovnanost pole, kde naši hráči podali
                        solidní výkony, které vyústily ve tři vítězství 3:2,
                        díky čemuž jsme se umístili na druhém místě naší
                        skupiny. Gratulujeme Polsku k vítězství v naší skupině s
                        výjimečnými výkony a chválíme zbytek týmů, proti kterým
                        jsme hráli.
                    </p>
                    <p>
                        Rádi bychom nasdíleli nezapomenutelný moment, kdy{" "}
                        <BGALink BGA_Username="J0nny" /> posledním tahem svého
                        rozhodujícího zápasu proti Chorvatsku spojil louky, což
                        otočilo hru a umožnilo mu vyhrát o dva body a našemu
                        týmu vyhrát zápas 3:2.
                    </p>
                    <p>
                        Ve čtvrtfinále jsme čelili silnému belgickému týmu a
                        bohužel se nám podařilo ukořistit pouze dva duely.
                        Celkově jsme na výkony našeho týmu hrdí a těšíme se na
                        budoucí turnaje. I když jsme byli opět o pár rozhodnutí
                        od průlomu, jsme motivováni k dalšímu zlepšování a
                        nadále cílíme na medaili.
                    </p>
                    <p>
                        Kromě toho <BGALink BGA_Username="chonps" /> dosáhl
                        velmi ceněného 10. místa na osobním Mistrovství světa.
                        Bylo to poprvé, co se pole rozrostlo na více než 50
                        hráčů, což činí tento úspěch ještě působivějším.
                        Gratulujeme chonpsovi za reprezentaci naší komunity na
                        světové scéně!
                    </p>
                </>
            ),
        },
    },

    {
        linkTo: ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP,
        imageSource: "/assets/news/deskohrani.jpg",
        title: {
            cs: "Mistrovství České republiky 2025",
            en: "National Championship of Czechia 2025",
        },
        date: new Date("2025-11-01"),
        content: {
            cs: (
                <p>
                    Dne 12. října 2025 se konalo mistrovství České republiky v
                    Carcassonne. Naše reprezentace na něm obsadila skvělých
                    prvních pět míst. Gratulujeme a přejeme šťastnou cestu do
                    Německa vítězovi <BGALink BGA_Username="Moya88" /> a
                    děkujeme všem účastníkům za skvělou atmosféru!
                </p>
            ),
            en: (
                <p>
                    On October 12, 2025, the National Championship of Czechia in
                    Carcassonne took place. Our representatives secured the top
                    five positions. Congratulations to the winner{" "}
                    <BGALink BGA_Username="Moya88" />, who will represent us in
                    Germany, and thanks to all participants for the great
                    atmosphere!
                </p>
            ),
        },
    },
];
