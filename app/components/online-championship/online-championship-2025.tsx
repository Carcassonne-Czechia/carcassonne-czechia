import { useContext } from "react";
import { LangContext } from "~/i18n/lang-context";

export default function OnlineChampionship2025() {
    const { lang } = useContext(LangContext);

    return lang === "en" ? (
        <div
            style={{
                backgroundColor: "rgba(227, 226, 226, 1)",
                padding: "0.5rem",
            }}
        >
            <h2 style={{ textAlign: "center", paddingTop: "0.5rem" }}>
                Online national championship 2025
            </h2>
            <div>
                <p>
                    <b>Sign-up form:</b>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSc2RXHWp4VQ23IACFY_VE9zTZzjr8ejvxASHFt1UaM-v4cVOA/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {" "}
                        CLICK
                    </a>
                </p>
                <p>
                    <b>Received sign-ups:</b>
                    <a
                        href="https://docs.google.com/spreadsheets/d/12SIPpqp6bmOsGUI1_aARHHGu1O88yg-Ol10Fz19tsls/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {" "}
                        SPREADSHEET
                    </a>
                </p>
                <p>
                    <b>Eligibility:</b> Each player may participate in only{" "}
                    <b>ONE</b> online national championship per tournament
                    season. Only someone who either has the Czech citizenship or
                    lives temporarily / permanently in Czechia may participate.
                </p>
                <p>
                    <b>Important dates:</b>
                    <ul>
                        <li>
                            <b>Registration:</b> August 2 up to August 24 23:59
                        </li>
                        <li>
                            <b>Tournament draw:</b> August 25
                        </li>
                        <li>
                            <b>Tournament start:</b> September 1
                        </li>
                        <li>
                            <b>Tournament end:</b>
                        </li>{" "}
                        Between October and Mid-November (according to the
                        number of players).
                    </ul>
                </p>
                <p>
                    <b>Tournament format:</b>
                    <ul>
                        <li>
                            Each pair of players will play one Best of Three
                            (BO3) match together.
                        </li>
                        <li>
                            During the draw, all matches will be scheduled for
                            their respective weeks. Each player will be
                            scheduled to play at most one match per week.
                        </li>
                        <li>
                            The players must agree on the exact time their match
                            will be played. When agreed, one of the players must
                            fill out a form indicating that time. Players will
                            in turn receive a tournament invitiation.
                        </li>
                        <li>
                            All games are played on BGA using the base game
                            Tournament format with <b>15 minutes</b> clock time
                            for each player.
                        </li>
                        <li>
                            In case of a game ending in a tie, the win goes to
                            the player who has not started (as usual on BGA).
                        </li>
                        <li>
                            Final results will be determined by, subsequently,
                            the number of won matches, the difference of games
                            won and lost, and the number of games won. In case
                            of a tie, these criteria will be applied once more,
                            but this time using only the matches between the
                            tied players.
                        </li>
                        <li>
                            In the unlikely event of more than 12 entrants, the
                            format will be changed to an 8-round swiss system.
                        </li>
                    </ul>
                </p>
                <p>
                    <b>Tournament rules:</b>
                    <ul>
                        <li>
                            Players are expected to play and attempt to win all
                            the matches they are supposed to play in.
                        </li>
                        <li>
                            Players are expected to complete their matches in a
                            timely manner, allowing sufficient options for match
                            scheduling. Ideally, matches should be scheduled
                            around the beginning of the week. If a player knows
                            they are going to be busy, it is desirable to
                            schedule matches even earlier to avoid backlogs.
                        </li>
                        <li>
                            If a player does not come to a match, we will ask
                            the players to reschedule at earliest convenience.
                        </li>
                        <li>
                            If it appears there are substantial issues with the
                            timely completion of matches, the team captain might
                            introduce a warning system akin to the one CCL 2025
                            used.
                        </li>
                        <li>
                            If a player is out of time in a game (signaled by
                            the red clock after the game ends), they lose the
                            game, but not the match.
                        </li>
                        <li>
                            Players must inform their opponents in case they
                            discard a tile.
                        </li>
                        <li>
                            Players may not use any tile-counters, scripts, or
                            any assistance by other humans or AIs during the
                            game.
                        </li>
                    </ul>
                </p>
                <p>
                    <b>Prizes:</b> The winners will receive the opportunity to
                    represent Czechia in the next Carcassonne Champions League
                    (CCL) season, according to the coeffient update after this
                    year's ETCOC.
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
            <h2 style={{ textAlign: "center" }}>Online mistrovství ČR 2025</h2>

            <div>
                <p>
                    <b>Přihlašovací formulář:</b>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSc2RXHWp4VQ23IACFY_VE9zTZzjr8ejvxASHFt1UaM-v4cVOA/viewform?usp=dialog">
                        {" "}
                        KLIKNĚTE
                    </a>
                </p>
                <p>
                    <b>Přijaté přihlášky:</b>
                    <a href="https://docs.google.com/spreadsheets/d/12SIPpqp6bmOsGUI1_aARHHGu1O88yg-Ol10Fz19tsls/edit?usp=sharing">
                        {" "}
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
                    <ul>
                        <li>
                            <b>Přihlašování:</b> 2. srpna až 24. srpna 23:59
                        </li>
                        <li>
                            <b>Rozlosování turnaje:</b> 25. srpna
                        </li>
                        <li>
                            <b>Začátek turnaje:</b> 1. září
                        </li>
                        <li>
                            <b>Konec turnaje:</b> Mezi říjnem a polovinou
                            listopadu (podle počtu hráčů).
                        </li>
                    </ul>
                </p>
                <p>
                    <b>Formát turnaje:</b>
                    <ul>
                        <li>
                            Každý pár hráčů odehraje spolu jeden zápas Best of
                            Three (BO3).
                        </li>
                        <li>
                            Při rozlosování se naplánují všechny zápasy na
                            příslušné týdny. Každý hráč bude mít naplánován
                            maximálně jeden zápas týdně.
                        </li>
                        <li>
                            Hráči se musí dohodnout na přesném čase, kdy se
                            jejich zápas bude hrát. Po dohodě jeden z hráčů
                            vyplní formulář, ve kterém uvede čas. Hráči pak
                            obdrží pozvánku do turnaje.
                        </li>
                        <li>
                            Všechny hry se hrají na BGA s použitím základní hry
                            v turnajovém formátu s <b>15 minutami</b> času pro
                            každého hráče.
                        </li>
                        <li>
                            V případě, že hra skončí remízou, vyhraje hráč,
                            který nezačal (jak je obvyklé na BGA).
                        </li>
                        <li>
                            Konečné výsledky se určí podle počtu vyhraných
                            zápasů, rozdílu vyhraných a prohraných her a počtu
                            vyhraných her. V případě remízy se tato kritéria
                            použijí znovu, ale tentokrát pouze na zápasy mezi
                            hráči, mezi nimiž je třeba určit pořadí.
                        </li>
                        <li>
                            V případě, že se přihlásí více než 12 hráčů, bude
                            formát změněn na 8-kolový švýcarský systém.
                        </li>
                    </ul>
                </p>
                <p>
                    <b>Pravidla turnaje:</b>
                    <ul>
                        <li>
                            Očekává se, že hráči odehrají s cílem vyhrát všechny
                            zápasy, kterých se účastní.
                        </li>
                        <li>
                            Hráči by měli dokončit své zápasy včas, aby bylo
                            možné naplánovat další zápasy. Ideálně by se zápasy
                            měly naplánovat kolem začátku týdne. Pokud hráč ví,
                            že bude zaneprázdněn, je žádoucí naplánovat zápasy
                            ještě dříve, aby se předešlo zpožděním.
                        </li>
                        <li>
                            Pokud hráč nepřijde na zápas, požádáme hráče o
                            přeplánování na co nejdříve.
                        </li>
                        <li>
                            Pokud se ukáže, že existují podstatné problémy s
                            včasným dokončením zápasů, může kapitán týmu zavést
                            varovný systém podobný tomu, který byl použit v CCL
                            2025.
                        </li>
                        <li>
                            Pokud hráči vyprší čas ve hře (signalizováno
                            červenými hodinami po skončení hry), prohraje hru,
                            ale ne zápas.
                        </li>
                        <li>
                            Hráči musí informovat soupeře v případě, že odhodí
                            kartičku.
                        </li>
                        <li>
                            Hráči nesmí používat žádná počítadla kartiček,
                            skripty nebo jakoukoli pomoc od jiných lidí nebo AI
                            během hry.
                        </li>
                    </ul>
                </p>
                <p>
                    <b>Odměny:</b> Vítězové získají možnost reprezentovat Česko
                    v příští sezóně Carcassonne Champions League (CCL), počet
                    míst bude záviset na aktualizaci koeficientu po letošním
                    ETCOC.
                </p>
            </div>
        </div>
    );
}
