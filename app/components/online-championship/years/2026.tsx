import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";

const detailsStyle: React.CSSProperties = { marginBottom: "0.5rem" };
const summaryStyle: React.CSSProperties = {
    cursor: "pointer",
    fontWeight: "bold",
    padding: "0.25rem 0",
};
const detailsBodyStyle: React.CSSProperties = {
    padding: "0.25rem 0 0.25rem 1rem",
};

export default function OnlineChampionship2026() {
    const { lang } = useContext(LangContext);

    return lang === "en" ? (
        <div
            style={{
                backgroundColor: "rgba(227, 226, 226, 1)",
                padding: "0.5rem",
            }}
        >
            <h2 style={{ textAlign: "center", paddingTop: "0.5rem" }}>
                Online national championship 2026
            </h2>
            <div>
                <p>
                    <b>Sign-up form:</b>{" "}
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScu-94XwwWhNjD--NTf3KiO6fHIUYkRjp9kZbCGz-rj7qe_DQ/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        FORM
                    </a>
                </p>
                <p>
                    <b>Received sign-ups:</b>{" "}
                    <a
                        href="https://docs.google.com/spreadsheets/d/1Az6iXX9_sxOLlE6BCRRTEVTVN67KQcmU8RTsK6mUJP0/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        SPREADSHEET
                    </a>
                </p>
                <p>
                    <b>Eligibility:</b> Each player may participate in only{" "}
                    <b>ONE</b> online national championship per tournament
                    season. Only someone who either has Czech citizenship or
                    lives temporarily / permanently in Czechia may participate.
                </p>
                <p>
                    <b>Important dates:</b>
                </p>
                <ul>
                    <li>
                        <b>Registration:</b> July 2 – August 24 23:59
                    </li>
                    <li>
                        <b>Tournament draw:</b> August 25
                    </li>
                    <li>
                        <b>Tournament start:</b> August 31
                    </li>
                    <li>
                        <b>Tournament end:</b> Between October and mid-November
                        (depending on the number of players).
                    </li>
                </ul>
                <p>
                    <b>Tournament format:</b>
                </p>
                <ul>
                    <li>
                        The format depends on the number of sign-ups:
                        <ul>
                            <li>
                                ≤8 players: single group (round-robin), no
                                play-offs
                            </li>
                            <li>≤12 players: 2 groups + play-offs</li>
                            <li>≤18 players: 3 groups + play-offs</li>
                            <li>
                                19+ players: 4 groups + play-offs (very
                                unlikely)
                            </li>
                        </ul>
                    </li>
                    <li>All matches are played as Best of Three (BO3).</li>
                    <li>
                        Each player is scheduled to play at most one match per
                        week.
                    </li>
                    <li>
                        The draw is <b>completely random</b> and conducted using
                        a publicly verifiable random seed derived from the
                        Bitcoin blockchain.{" "}
                        <a href="/online-championship/draw">
                            See draw methodology.
                        </a>
                    </li>
                </ul>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Tournament structure (1 group)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            All players play each other (round-robin). The final
                            standings are determined by:
                        </p>
                        <ol>
                            <li>Number of matches won</li>
                            <li>
                                Percentage of games won (games won / games
                                played)
                            </li>
                            <li>Number of games won</li>
                            <li>
                                Head-to-head: if players are still tied, the
                                above criteria are applied to their mutual
                                matches only. If still tied, the result is
                                determined by draw.
                            </li>
                        </ol>
                        <p>
                            There are no play-offs; the final standings are the
                            tournament result.
                        </p>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Tournament structure (2 groups)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Players are divided into 2 groups (A and B) at
                            random. If the number of players is odd, Group A
                            receives the extra player. Players play a
                            round-robin within their group.
                        </p>
                        <p>
                            <b>Group ranking criteria:</b>
                        </p>
                        <ol>
                            <li>Number of matches won</li>
                            <li>
                                Percentage of games won (games won / games
                                played)
                            </li>
                            <li>Number of games won</li>
                            <li>
                                Head-to-head: if players are still tied, the
                                above criteria are applied to their mutual
                                matches only. If still tied, the result is
                                determined by draw.
                            </li>
                        </ol>
                        <p>
                            The top 3 players from each group advance to the
                            play-offs (6 total). The 1st-place player from each
                            group receives a bye to the semi-finals.
                        </p>
                        <p>
                            <b>Play-off bracket:</b>
                        </p>
                        <ul>
                            <li>
                                Quarter-final 1: 2nd in Group A vs 3rd in Group
                                B
                            </li>
                            <li>
                                Quarter-final 2: 2nd in Group B vs 3rd in Group
                                A
                            </li>
                            <li>Semi-final 1: QF1 winner vs 1st in Group B</li>
                            <li>Semi-final 2: QF2 winner vs 1st in Group A</li>
                            <li>Final: SF1 winner vs SF2 winner</li>
                            <li>Bronze medal match: SF1 loser vs SF2 loser</li>
                        </ul>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Tournament structure (3 groups)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Players are divided into 3 groups (A, B, and C) at
                            random. If the count is not divisible by 3, earlier
                            groups receive the extra players. Players play a
                            round-robin within their group.
                        </p>
                        <p>
                            <b>Group ranking criteria:</b>
                        </p>
                        <ol>
                            <li>Number of matches won</li>
                            <li>
                                Percentage of games won (games won / games
                                played)
                            </li>
                            <li>Number of games won</li>
                            <li>
                                Head-to-head: if players are still tied, the
                                above criteria are applied to their mutual
                                matches only. If still tied, the result is
                                determined by draw.
                            </li>
                        </ol>
                        <p>
                            The top 2 players from each group advance (6 total).
                            To seed the play-offs, an overall ranking is
                            computed:
                        </p>
                        <ol>
                            <li>
                                Group position (1st place ranks higher than 2nd
                                place)
                            </li>
                            <li>Percentage of matches won (within group)</li>
                            <li>Percentage of games won (within group)</li>
                            <li>Number of games won (within group)</li>
                            <li>
                                Head-to-head (above criteria applied to mutual
                                matches only)
                            </li>
                        </ol>
                        <p>
                            Overall seeds 1 and 2 receive byes to the
                            semi-finals.
                        </p>
                        <p>
                            <b>Play-off bracket:</b>
                        </p>
                        <ul>
                            <li>Quarter-final 1: Overall 3rd vs Overall 6th</li>
                            <li>Quarter-final 2: Overall 4th vs Overall 5th</li>
                            <li>Semi-final 1: QF1 winner vs Overall 2nd</li>
                            <li>Semi-final 2: QF2 winner vs Overall 1st</li>
                            <li>Final: SF1 winner vs SF2 winner</li>
                            <li>Bronze medal match: SF1 loser vs SF2 loser</li>
                        </ul>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Tournament structure (4 groups)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Players are divided into 4 groups (A, B, C, and D)
                            at random. If uneven, earlier groups receive the
                            extra players. Players play a round-robin within
                            their group.
                        </p>
                        <p>
                            <b>Group ranking criteria:</b>
                        </p>
                        <ol>
                            <li>Number of matches won</li>
                            <li>
                                Percentage of games won (games won / games
                                played)
                            </li>
                            <li>Number of games won</li>
                            <li>
                                Head-to-head: if players are still tied, the
                                above criteria are applied to their mutual
                                matches only. If still tied, the result is
                                determined by draw.
                            </li>
                        </ol>
                        <p>
                            The top 2 players from each group advance (8 total).
                        </p>
                        <p>
                            <b>Play-off bracket:</b>
                        </p>
                        <ul>
                            <li>
                                Quarter-final 1: 1st in Group A vs 2nd in Group
                                B
                            </li>
                            <li>
                                Quarter-final 2: 1st in Group C vs 2nd in Group
                                D
                            </li>
                            <li>
                                Quarter-final 3: 1st in Group B vs 2nd in Group
                                A
                            </li>
                            <li>
                                Quarter-final 4: 1st in Group D vs 2nd in Group
                                C
                            </li>
                            <li>Semi-final 1: QF1 winner vs QF2 winner</li>
                            <li>Semi-final 2: QF3 winner vs QF4 winner</li>
                            <li>Final: SF1 winner vs SF2 winner</li>
                            <li>Bronze medal match: SF1 loser vs SF2 loser</li>
                        </ul>
                    </div>
                </details>

                <p>
                    <b>Tournament rules:</b>
                </p>
                <ul>
                    <li>
                        Players are expected to play and attempt to win all the
                        matches they are supposed to play in.
                    </li>
                    <li>
                        Players are expected to complete their matches in a
                        timely manner, allowing sufficient options for match
                        scheduling. Ideally, matches should be scheduled around
                        the beginning of the week. If a player knows they are
                        going to be busy, it is desirable to schedule matches
                        even earlier to avoid backlogs.
                    </li>
                    <li>
                        If a player does not come to a match, we will ask the
                        players to reschedule at earliest convenience.
                    </li>
                    <li>
                        If it appears there are substantial issues with the
                        timely completion of matches, the team captain might
                        introduce a warning system similar to the ones used in
                        past CCL seasons.
                    </li>
                    <li>
                        If a player is out of time in a game (signaled by the
                        red clock after the game ends), they lose the game, but
                        not the match.
                    </li>
                    <li>
                        Players must inform their opponents in case they discard
                        a tile.
                    </li>
                    <li>
                        Players may not use any tile-counters, scripts, or any
                        assistance by other humans or AIs during the game.
                    </li>
                    <li>
                        If the players realize that a game is being played with
                        wrong settings, the course of action depends on the
                        number of remaining tiles in the deck:
                        <ul>
                            <li>
                                If there are at least 60 tiles left, the game
                                must be restarted by setting up a new
                                tournament.
                            </li>
                            <li>
                                Otherwise, the game must be played until the end
                                and if there are any games left that would be
                                played with wrong settings, a new tournament
                                must be created.
                            </li>
                        </ul>
                    </li>
                </ul>

                <p>
                    <b>Prizes:</b> The winners will receive the opportunity to
                    represent Czechia in the next Carcassonne Champions League
                    (CCL) season, according to the (as of July 2026, not yet
                    available) 2026 Association coefficient{" "}
                    <a
                        href="https://carcassonne.gg/Association-Ranking-2026/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        table
                    </a>
                    .
                </p>
            </div>
        </div>
    ) : (
        <div
            style={{
                backgroundColor: "rgba(227, 226, 226, 1)",
                padding: "0.5rem",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Online mistrovství ČR 2026</h2>

            <div>
                <p>
                    <b>Přihlašovací formulář:</b>{" "}
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScu-94XwwWhNjD--NTf3KiO6fHIUYkRjp9kZbCGz-rj7qe_DQ/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        FORMULÁŘ
                    </a>
                </p>
                <p>
                    <b>Přijaté přihlášky:</b>{" "}
                    <a
                        href="https://docs.google.com/spreadsheets/d/1Az6iXX9_sxOLlE6BCRRTEVTVN67KQcmU8RTsK6mUJP0/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TABULKA
                    </a>
                </p>
                <p>
                    <b>Právo startovat:</b> Každý hráč se smí účastnit pouze{" "}
                    <b>JEDNOHO</b> online mistrovství v dané turnajové sezóně.
                    Dále musí mít české občanství nebo žít v Česku.
                </p>
                <p>
                    <b>Důležité termíny:</b>
                </p>
                <ul>
                    <li>
                        <b>Přihlašování:</b> 2. července – 24. srpna 23:59
                    </li>
                    <li>
                        <b>Rozlosování turnaje:</b> 25. srpna
                    </li>
                    <li>
                        <b>Začátek turnaje:</b> 31. srpna
                    </li>
                    <li>
                        <b>Konec turnaje:</b> Mezi říjnem a polovinou listopadu
                        (podle počtu hráčů).
                    </li>
                </ul>
                <p>
                    <b>Formát turnaje:</b>
                </p>
                <ul>
                    <li>
                        Formát závisí na počtu přihlášených:
                        <ul>
                            <li>
                                ≤8 hráčů: jedna skupina (každý s každým), bez
                                play-off
                            </li>
                            <li>≤12 hráčů: 2 skupiny + play-off</li>
                            <li>≤18 hráčů: 3 skupiny + play-off</li>
                            <li>
                                19+ hráčů: 4 skupiny + play-off (velmi
                                nepravděpodobné)
                            </li>
                        </ul>
                    </li>
                    <li>
                        Všechny zápasy se hrají formátem Best of Three (BO3).
                    </li>
                    <li>
                        Každý hráč má naplánován maximálně jeden zápas týdně.
                    </li>
                    <li>
                        <b>Zcela náhodné losování</b> provedeme pomocí veřejně
                        ověřitelného seedu odvozeného z Bitcoinového
                        blockchainu.{" "}
                        <a href="/online-championship/draw">
                            Viz metodika losování.
                        </a>
                    </li>
                </ul>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Struktura turnaje (1 skupina)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Všichni hráči hrají navzájem (každý s každým).
                            Konečné pořadí se určí podle:
                        </p>
                        <ol>
                            <li>Počet vyhraných zápasů</li>
                            <li>
                                Procento vyhraných her (vyhrané hry / odehrané
                                hry)
                            </li>
                            <li>Počet vyhraných her</li>
                            <li>
                                Vzájemný výsledek: pokud jsou hráči stále
                                nastejno, výše uvedená kritéria se použijí pouze
                                na jejich vzájemné zápasy. Pokud jsou stále
                                nastejno, pořadí se určí losem.
                            </li>
                        </ol>
                        <p>
                            Play-off se nehraje; konečné pořadí skupiny je
                            výsledkem turnaje.
                        </p>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Struktura turnaje (2 skupiny)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Hráči jsou náhodně rozděleni do 2 skupin (A a B).
                            Pokud je počet hráčů lichý, Skupina A bude o hráče
                            větší. Hráči ve skupině hrají každý s každým.
                        </p>
                        <p>
                            <b>Kritéria pořadí ve skupině:</b>
                        </p>
                        <ol>
                            <li>Počet vyhraných zápasů</li>
                            <li>
                                Procento vyhraných her (vyhrané hry / odehrané
                                hry)
                            </li>
                            <li>Počet vyhraných her</li>
                            <li>
                                Vzájemný výsledek: pokud jsou hráči stále
                                nastejno, výše uvedená kritéria se použijí pouze
                                na jejich vzájemné zápasy. Pokud jsou stále
                                nastejno, pořadí se určí losem.
                            </li>
                        </ol>
                        <p>
                            Do play-off postupují nejlepší 3 hráči z každé
                            skupiny (celkem 6). Hráč na 1. místě každé skupiny
                            postoupí přímo do semifinále.
                        </p>
                        <p>
                            <b>Pavouk play-off:</b>
                        </p>
                        <ul>
                            <li>
                                Čtvrtfinále 1: 2. ve Skupině A vs 3. ve Skupině
                                B
                            </li>
                            <li>
                                Čtvrtfinále 2: 2. ve Skupině B vs 3. ve Skupině
                                A
                            </li>
                            <li>Semifinále 1: vítěz ČF1 vs 1. ve Skupině B</li>
                            <li>Semifinále 2: vítěz ČF2 vs 1. ve Skupině A</li>
                            <li>Finále: vítěz SF1 vs vítěz SF2</li>
                            <li>
                                Zápas o 3. místo: poražený SF1 vs poražený SF2
                            </li>
                        </ul>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Struktura turnaje (3 skupiny)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Hráči jsou náhodně rozděleni do 3 skupin (A, B a C).
                            Pokud počet není dělitelný třemi, dřívější skupiny
                            dostanou přebývající hráče. Hráči ve skupině hrají
                            každý s každým.
                        </p>
                        <p>
                            <b>Kritéria pořadí ve skupině:</b>
                        </p>
                        <ol>
                            <li>Počet vyhraných zápasů</li>
                            <li>
                                Procento vyhraných her (vyhrané hry / odehrané
                                hry)
                            </li>
                            <li>Počet vyhraných her</li>
                            <li>
                                Vzájemný výsledek: pokud jsou hráči stále
                                shodně, výše uvedená kritéria se použijí pouze
                                na jejich vzájemné zápasy. Pokud jsou stále
                                shodně, pořadí se určí losem.
                            </li>
                        </ol>
                        <p>
                            Z každé skupiny postupují 2 nejlepší hráči (celkem
                            6). Pro nasazení do play-off se vypočítá celkové
                            pořadí:
                        </p>
                        <ol>
                            <li>
                                Umístění ve skupině (1. místo je výše než 2.
                                místo)
                            </li>
                            <li>Procento vyhraných zápasů (ve skupině)</li>
                            <li>Procento vyhraných her (ve skupině)</li>
                            <li>Počet vyhraných her (ve skupině)</li>
                            <li>
                                Vzájemný výsledek (výše uvedená kritéria
                                aplikovaná pouze na vzájemné zápasy)
                            </li>
                        </ol>
                        <p>
                            Celkové nasazení 1 a 2 postupují přímo do
                            semifinále.
                        </p>
                        <p>
                            <b>Pavouk play-off:</b>
                        </p>
                        <ul>
                            <li>Čtvrtfinále 1: Celkově 3. vs celkově 6.</li>
                            <li>Čtvrtfinále 2: Celkově 4. vs celkově 5.</li>
                            <li>Semifinále 1: vítěz ČF1 vs celkově 2.</li>
                            <li>Semifinále 2: vítěz ČF2 vs celkově 1.</li>
                            <li>Finále: vítěz SF1 vs vítěz SF2</li>
                            <li>
                                Zápas o 3. místo: poražený SF1 vs poražený SF2
                            </li>
                        </ul>
                    </div>
                </details>

                <details style={detailsStyle}>
                    <summary style={summaryStyle}>
                        Struktura turnaje (4 skupiny)
                    </summary>
                    <div style={detailsBodyStyle}>
                        <p>
                            Hráči jsou náhodně rozděleni do 4 skupin (A, B, C a
                            D). Pokud je počet nerovnoměrný, dřívější skupiny
                            dostanou přebývající hráče. Hráči ve skupině hrají
                            každý s každým.
                        </p>
                        <p>
                            <b>Kritéria pořadí ve skupině:</b>
                        </p>
                        <ol>
                            <li>Počet vyhraných zápasů</li>
                            <li>
                                Procento vyhraných her (vyhrané hry / odehrané
                                hry)
                            </li>
                            <li>Počet vyhraných her</li>
                            <li>
                                Vzájemný výsledek: pokud jsou hráči stále
                                shodně, výše uvedená kritéria se použijí pouze
                                na jejich vzájemné zápasy. Pokud jsou stále
                                shodně, pořadí se určí losem.
                            </li>
                        </ol>
                        <p>
                            Z každé skupiny postupují 2 nejlepší hráči (celkem
                            8).
                        </p>
                        <p>
                            <b>Pavouk play-off:</b>
                        </p>
                        <ul>
                            <li>
                                Čtvrtfinále 1: 1. ve Skupině A vs 2. ve Skupině
                                B
                            </li>
                            <li>
                                Čtvrtfinále 2: 1. ve Skupině C vs 2. ve Skupině
                                D
                            </li>
                            <li>
                                Čtvrtfinále 3: 1. ve Skupině B vs 2. ve Skupině
                                A
                            </li>
                            <li>
                                Čtvrtfinále 4: 1. ve Skupině D vs 2. ve Skupině
                                C
                            </li>
                            <li>Semifinále 1: vítěz ČF1 vs vítěz ČF2</li>
                            <li>Semifinále 2: vítěz ČF3 vs vítěz ČF4</li>
                            <li>Finále: vítěz SF1 vs vítěz SF2</li>
                            <li>
                                Zápas o 3. místo: poražený SF1 vs poražený SF2
                            </li>
                        </ul>
                    </div>
                </details>

                <p>
                    <b>Pravidla turnaje:</b>
                </p>
                <ul>
                    <li>
                        Očekává se, že hráči odehrají s cílem vyhrát všechny
                        zápasy, kterých se účastní.
                    </li>
                    <li>
                        Hráči by měli dokončit své zápasy včas, aby bylo možné
                        naplánovat další zápasy. Ideálně by se zápasy měly
                        naplánovat kolem začátku týdne. Pokud hráč ví, že bude
                        zaneprázdněn, je žádoucí naplánovat zápasy ještě dříve,
                        aby se předešlo zpožděním.
                    </li>
                    <li>
                        Pokud hráč nepřijde na zápas, požádáme hráče o
                        přeplánování na co nejdříve.
                    </li>
                    <li>
                        Pokud se ukáže, že existují podstatné problémy s včasným
                        dokončením zápasů, může kapitán týmu zavést varovný
                        systém podobný těm, které byly použity v minulých
                        sezónách CCL.
                    </li>
                    <li>
                        Pokud hráči vyprší čas ve hře (signalizováno červenými
                        hodinami po skončení hry), prohraje hru, ale ne zápas.
                    </li>
                    <li>
                        Hráči musí informovat soupeře v případě, že odhodí
                        kartičku.
                    </li>
                    <li>
                        Hráči nesmí používat žádná počítadla kartiček, skripty
                        nebo jakoukoli pomoc od jiných lidí nebo AI během hry.
                    </li>
                    <li>
                        Pokud hráči zjistí, že se hra hraje s nesprávným
                        nastavením, postup závisí na počtu zbývajících kartiček
                        v balíčku:
                        <ul>
                            <li>
                                Pokud zbývá alespoň 60 kartiček, musí se hra
                                restartovat vytvořením nového turnaje.
                            </li>
                            <li>
                                V opačném případě se hra musí dohrát do konce a
                                pokud zbývají nějaké hry, které by se hrály s
                                nesprávným nastavením, musí se vytvořit nový
                                turnaj.
                            </li>
                        </ul>
                    </li>
                </ul>

                <p>
                    <b>Odměny:</b> Vítězové získají možnost reprezentovat Česko
                    v příští sezóně Carcassonne Champions League (CCL), počet
                    míst bude záviset na (k červenci 2026 zatím neexistující){" "}
                    <a
                        href="https://carcassonne.gg/Association-Ranking-2026/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        tabulce
                    </a>{" "}
                    asociačních koeficientů pro rok 2026.
                </p>
            </div>
        </div>
    );
}
