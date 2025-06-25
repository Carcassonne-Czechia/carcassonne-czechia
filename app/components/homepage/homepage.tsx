import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";
import { teamCaptainBGAUsername } from "~/players/team-members";
import BGALink from "../bga-link";
import { Link } from "react-router";
import { ROUTE_HEADERS } from "~/routes";

export function HomePage() {
    const { lang } = useContext(LangContext);

    return lang === "en" ? (
        <main style={{ marginTop: "1rem" }}>
            <h3>Welcome to the website of the Czech national team.</h3>
            <p>
                The website is still under construction. However, you can
                already check out the current roster, stats, and former and
                planned tournaments organized by the Czech community.
            </p>
        </main>
    ) : (
        <main style={{ marginTop: "1rem" }}>
            <h3>
                Vítejte na stránkách českého národního týmu ve hře Carcassonne
            </h3>
            <p>
                Tým byl založen za pandemie v roce 2020 starou partou kolem
                Hurtla, Moyi a jeho kamarádů z MČR. Tým sdružuje hráče z České
                republiky, kteří se účastní turnajů a soutěží v této oblíbené
                deskové hře.
            </p>
            <p>
                Nedlouho po založení převzal roli kapitána týmu Marty, který nás
                úspěšně provedl světovými a evropskými šampionáty týmů (známými
                pod zkratkami{" "}
                <a href="https://www.carcassonne.cat/wtcoc/index.php">WTCOC</a>{" "}
                a <a href="https://www.carcassonne.cat/etcoc2023/">ETCOC</a>). V
                roce 2025 Marty předal štafetu Posijovi, který se stal novým
                kapitánem týmu.
            </p>
            <p>
                Většina turnajů se hraje online na platformě{" "}
                <a href="https://boardgamearena.com">BoardGameArena</a> (BGA). V
                Praze se každoročně v říjnu koná{" "}
                <Link to={ROUTE_HEADERS.NATIONAL_CHAMPIONSHIP}>
                    Mistrovství České republiky
                </Link>
                , které je největší prezenční akcí pro českou komunitu
                Carcassonne hráčů. Z tohoto turnaje se kvalifikuje nejlepší hráč
                na{" "}
                <a href="https://carcassonne-meisterschaft.de/">
                    mistrovství světa
                </a>{" "}
                konaného napřesrok ve městě Herne v Německu.
            </p>
            <p>
                Mimoto se můžete zúčastnit{" "}
                <Link to={ROUTE_HEADERS.ONLINE_CHAMPIONSHIP}>
                    Online mistrovství České republiky
                </Link>
                , které každoročně na podzim organizuje naše komunita.
            </p>
            <p>
                Stránky jsou stále ve výstavbě. Můžete si ale prohlédnout
                aktuální soupisku, statistiky a bývalé a plánované turnaje
                pořádané českou komunitou.
            </p>
            <p
                style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "2rem",
                }}
            >
                Pokud máte zájem se přidat do týmu, pak můžete napsat na BGA
                současnému kapitánovi týmu{" "}
                {<BGALink BGA_Username={teamCaptainBGAUsername} />}, přidáme vás
                na náš Discord a můžete hrát s námi.
            </p>
        </main>
    );
}
